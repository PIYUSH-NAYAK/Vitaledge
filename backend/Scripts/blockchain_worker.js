require('dotenv').config();
const connectDB = require('../Utils/db');
const BlockchainJob = require('../Models/BlockchainJob');
const Order = require('../Models/Order');
const blockchainService = require('../Utils/blockchainService');

// Simple worker that polls pending blockchain jobs and processes them
const POLL_INTERVAL_MS = parseInt(process.env.BLOCKCHAIN_WORKER_POLL_MS || '5000', 10);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processJob(job) {
  console.log(`Processing job ${job._id} type=${job.jobType} attempts=${job.attempts}`);
  try {
    job.status = 'running';
    await job.save();

    if (job.jobType === 'createBatch') {
      const { batchId, manufacturer } = job.payload || {};
      const res = await blockchainService.createMedicineBatch(batchId, manufacturer);
      if (res && res.success) {
        // update order with blockchain info
        if (job.orderId) {
          const order = await Order.findOne({ orderId: job.orderId });
          if (order) {
            order.blockchain = {
              batchId: res.batchAccount,
              contractAddress: res.batchAccount,
              transactionHash: res.signature || res.transactionHash || null
            };
            await order.save();
          }
        }
        job.status = 'success';
        job.lastError = null;
        await job.save();
        console.log(`✅ Job ${job._id} succeeded`);
        return;
      } else {
        throw new Error(res && res.error ? res.error : 'Unknown createBatch failure');
      }
    }

    if (job.jobType === 'transferOwnership') {
      const { batchId, newOwner } = job.payload || {};
      const { wallet } = require('../Utils/solanaConnection');
      const res = await blockchainService.transferBatchOwnership(batchId, newOwner, wallet);
      if (res && res.success) {
        job.status = 'success';
        job.lastError = null;
        // update order metadata if present
        if (job.orderId) {
          const order = await Order.findOne({ orderId: job.orderId });
          if (order) {
            order.blockchain = order.blockchain || {};
            order.blockchain.currentOwner = newOwner;
            await order.save();
          }
        }
        await job.save();
        console.log(`✅ Transfer job ${job._id} succeeded`);
        return;
      } else {
        throw new Error(res && res.error ? res.error : 'Unknown transferOwnership failure');
      }
    }

  } catch (err) {
    console.error(`❌ Job ${job._id} failed:`, err.message || err);
    job.attempts = (job.attempts || 0) + 1;
    job.lastError = err.message || String(err);

    if (job.attempts >= (job.maxAttempts || 5)) {
      job.status = 'failed';
      await job.save();
      console.error(`❌ Job ${job._id} reached max attempts and is marked failed.`);
      return;
    }

    // schedule next attempt with exponential backoff (base 60s)
    const backoffSeconds = Math.pow(2, job.attempts) * 60;
    job.nextAttemptAt = new Date(Date.now() + backoffSeconds * 1000);
    job.status = 'pending';
    await job.save();
    console.log(`⏳ Job ${job._id} will retry at ${job.nextAttemptAt.toISOString()}`);
  }
}

async function runWorker() {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to database:', err.message);
    console.error('Worker cannot start without database. Exiting...');
    process.exit(1);
  }

  console.log('🔁 Blockchain worker started. Polling for jobs...');

  while (true) {
    try {
      const now = new Date();
      const job = await BlockchainJob.findOneAndUpdate(
        { status: { $in: ['pending'] }, nextAttemptAt: { $lte: now } },
        { $set: { status: 'running' } },
        { sort: { createdAt: 1 }, new: true }
      );

      if (job) {
        // process job (note: it will set status/rerun as needed)
        await processJob(job);
      } else {
        // nothing to do, sleep
        await sleep(POLL_INTERVAL_MS);
      }
    } catch (err) {
      console.error('Worker loop error:', err);
      await sleep(5000);
    }
  }
}

runWorker().catch(err => {
  console.error('Blockchain worker failed to start:', err);
  process.exit(1);
});
