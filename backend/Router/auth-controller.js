const contact = require("../Models/contactModel");
const user = require("../Models/User-Model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connection, wallet, web3 } = require('../Utils/solanaConnection');
const { PublicKey, Transaction, TransactionInstruction, SystemProgram } = web3;

// ✅ Home Route
const home = (req, res) => {
    res.send('Hello, World!');
};

// ✅ Contact Us Controller
const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(422).json({ error: "Please fill the contact form" });
        }
        await contact.create({ name, email, message });
        return res.status(201).json({ msg: "Message Sent Successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ msg: "Error processing contact form", error: error.message });
    }
};

// ✅ Register User Controller
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const userExist = await user.findOne({ email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ error: "Password does not match" });
        }
        const salt = 10;
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await user.create({ name, email, password: hashedPass, confirmPassword: hashedPass });
        res.status(201).json({ msg: "User registered successfully", token: await newUser.genToken(), userId: newUser._id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: "Server error during registration", error: error.message });
    }
};

// ✅ Login User Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(422).json({ message: "Create Account First" });
        }
        const validPass = await bcrypt.compare(password, userExist.password);
        if (validPass) {
            return res.status(201).json({ message: "Login Successful", token: await userExist.genToken(), userId: userExist._id });
        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// ✅ Authenticated User Data
const authUser = async (req, res) => {
    try {
        const userData = req.user;
        res.status(200).json({ userData });
        console.log(userData);
    } catch (error) {
        console.error("Server Error:", error);
    }
};

// ✅ Encode CreateBatch Instruction for Phantom
const encodeCreateBatchInstruction = (batch_id, manufacturer) => {
    const variant = Buffer.from([0]);
    const batchIdBuffer = Buffer.from(batch_id, 'utf8');
    const batchIdLength = Buffer.alloc(4);
    batchIdLength.writeUInt32LE(batchIdBuffer.length, 0);

    const manufacturerBuffer = Buffer.from(manufacturer, 'utf8');
    const manufacturerLength = Buffer.alloc(4);
    manufacturerLength.writeUInt32LE(manufacturerBuffer.length, 0);

    return Buffer.concat([variant, batchIdLength, batchIdBuffer, manufacturerLength, manufacturerBuffer]);
};

// ✅ Create Batch (Solana)
// ✅ Create Batch (Solana) using Phantom Wallet
const createBatch = async (req, res) => {
    try {
        const { batch_id, manufacturer, walletAddress } = req.body;

        if (!batch_id || !manufacturer || !walletAddress) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ Check if walletAddress is valid
        const userPublicKey = new PublicKey(walletAddress);

        // ✅ Define Program ID of the deployed contract
        const programId = new PublicKey('FpFSwQCbsLiThFsBSpT79Z4CpvNQm7tpiC3wtrsYyzQ6');
        const batchKeypair = web3.Keypair.generate();

        console.log('Batch ID:', batch_id);
        console.log('Manufacturer:', manufacturer);
        console.log('User Wallet Address:', walletAddress);

        // ✅ Encode the instruction data
        const data = encodeCreateBatchInstruction(batch_id, manufacturer);

        // ✅ Create the transaction instruction with the user's wallet
        const instruction = new TransactionInstruction({
            keys: [
                { pubkey: userPublicKey, isSigner: true, isWritable: true }, // Phantom Wallet as Signer
                { pubkey: batchKeypair.publicKey, isSigner: false, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            ],
            programId,
            data,
        });

        // ✅ Create and send the transaction using Phantom
        const transaction = new Transaction().add(instruction);
        const signature = await web3.sendAndConfirmTransaction(connection, transaction, [batchKeypair]);

        res.json({
            success: true,
            tx: signature,
            batchPublicKey: batchKeypair.publicKey.toBase58(),
        });
    } catch (error) {
        console.error('Create Batch Error:', error);
        res.status(500).json({ success: false, error: error.toString() });
    }
};


// ✅ Send Signed Transaction from Phantom via Postman
const sendTransaction = async (req, res) => {
    try {
        const { signedTx } = req.body;

        if (!signedTx) {
            return res.status(400).json({ error: "Signed transaction is missing" });
        }

        // ✅ Send raw transaction to Solana
        const signature = await connection.sendRawTransaction(
            Buffer.from(signedTx, 'base64'),
            { skipPreflight: false, preflightCommitment: "confirmed" }
        );

        // ✅ Confirm transaction
        await connection.confirmTransaction(signature, 'confirmed');

        res.status(200).json({
            success: true,
            tx: signature,
        });
    } catch (error) {
        console.error("Transaction Error:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
};

module.exports = {
    home,
    contactUs,
    register,
    login,
    authUser,
    createBatch,
    sendTransaction, // ✅ Add sendTransaction
};
