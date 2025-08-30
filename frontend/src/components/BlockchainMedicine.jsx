import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockchainService from '../services/blockchainService';
import { useWallet } from '@solana/wallet-adapter-react';

const BlockchainMedicine = () => {
    const [isContractConnected, setIsContractConnected] = useState(false);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newBatch, setNewBatch] = useState({
        batchId: '',
        manufacturer: '',
        medicineName: '',
        productionDate: '',
        expiryDate: ''
    });

    const wallet = useWallet();

    useEffect(() => {
        testContractConnection();
        loadBatches();
    }, []);

    const testContractConnection = async () => {
        const connected = await blockchainService.testConnection();
        setIsContractConnected(connected);
        
        if (connected) {
            toast.success('✅ Blockchain contract connected!');
        } else {
            toast.error('❌ Contract connection failed');
        }
    };

    const loadBatches = async () => {
        const result = await blockchainService.getAllBatches();
        if (result.success) {
            setBatches(result.batches);
        }
    };

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        
        if (!wallet.connected) {
            toast.error('Please connect your wallet first');
            return;
        }

        setLoading(true);
        try {
            const result = await blockchainService.createMedicineBatch(wallet, newBatch);
            
            if (result.success) {
                toast.success('🎉 Medicine batch created on blockchain!');
                setNewBatch({
                    batchId: '',
                    manufacturer: '',
                    medicineName: '',
                    productionDate: '',
                    expiryDate: ''
                });
                loadBatches(); // Reload batches
            } else {
                toast.error(`Failed to create batch: ${result.error}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyBatch = async (batchId) => {
        const result = await blockchainService.verifyMedicineBatch(batchId);
        
        if (result.success && result.verified) {
            toast.success(`✅ Batch ${batchId} verified on blockchain!`);
        } else {
            toast.error(`❌ Batch ${batchId} verification failed`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Contract Status */}
            <div className="mb-8 p-4 rounded-lg border">
                <h2 className="text-xl font-bold mb-2">Blockchain Contract Status</h2>
                <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isContractConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={isContractConnected ? 'text-green-600' : 'text-red-600'}>
                        {isContractConnected ? 'Contract Connected' : 'Contract Disconnected'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Program ID: DBL4hbkkDsVHwDBSKGmA4ivneVR8Zf5RHmYHpE1XrR8x
                </p>
            </div>

            {/* Create New Batch */}
            <div className="mb-8 p-6 border rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-4">Create Medicine Batch on Blockchain</h3>
                
                <form onSubmit={handleCreateBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Batch ID"
                            value={newBatch.batchId}
                            onChange={(e) => setNewBatch({...newBatch, batchId: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Manufacturer"
                            value={newBatch.manufacturer}
                            onChange={(e) => setNewBatch({...newBatch, manufacturer: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Medicine Name"
                            value={newBatch.medicineName}
                            onChange={(e) => setNewBatch({...newBatch, medicineName: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="date"
                            placeholder="Production Date"
                            value={newBatch.productionDate}
                            onChange={(e) => setNewBatch({...newBatch, productionDate: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                        <input
                            type="date"
                            placeholder="Expiry Date"
                            value={newBatch.expiryDate}
                            onChange={(e) => setNewBatch({...newBatch, expiryDate: e.target.value})}
                            className="border rounded px-3 py-2"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading || !wallet.connected || !isContractConnected}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                    >
                        {loading ? 'Creating...' : 'Create Batch on Blockchain'}
                    </button>
                </form>

                {!wallet.connected && (
                    <p className="text-red-500 text-sm mt-2">
                        Please connect your wallet to create batches
                    </p>
                )}
            </div>

            {/* Existing Batches */}
            <div className="p-6 border rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-4">Blockchain Medicine Batches</h3>
                
                {batches.length === 0 ? (
                    <p className="text-gray-500">No batches found on blockchain</p>
                ) : (
                    <div className="space-y-3">
                        {batches.map((batch, index) => (
                            <div key={index} className="border rounded p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Batch ID: {batch.id}</p>
                                    <p className="text-sm text-gray-600">Address: {batch.address}</p>
                                    <p className="text-sm text-gray-600">Data Length: {batch.dataLength} bytes</p>
                                </div>
                                <button
                                    onClick={() => handleVerifyBatch(batch.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                >
                                    Verify
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockchainMedicine;
