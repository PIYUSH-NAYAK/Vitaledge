import WalletConnectButton from '../comp2/walletconnect';

const WalletTest = () => {
  
  // Direct MetaMask test function
  const testMetaMaskDirect = async () => {
    console.log("🧪 Direct MetaMask test starting...");
    console.log("window.ethereum:", window.ethereum);
    console.log("isMetaMask:", window.ethereum?.isMetaMask);
    console.log("providers:", window.ethereum?.providers);
    
    if (!window.ethereum) {
      alert("❌ No window.ethereum found");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("✅ Direct MetaMask test success:", accounts);
      alert(`✅ MetaMask connected: ${accounts[0]}`);
    } catch (error) {
      console.error("❌ Direct MetaMask test failed:", error);
      alert(`❌ MetaMask test failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-n-8 flex items-center justify-center p-4">
      <div className="bg-n-7 border border-n-6 rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Wallet Connection Test
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <WalletConnectButton />
          </div>
          
          <div className="border-t border-n-6 pt-4">
            <h3 className="text-sm font-medium text-n-1 mb-3">Direct Tests:</h3>
            <button
              onClick={testMetaMaskDirect}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mb-2 transition"
            >
              🦊 Test MetaMask Direct
            </button>
          </div>
          
          <div className="text-xs text-n-4 text-center">
            <p>Open browser console (F12) to see debug information</p>
          </div>
          
          <div className="bg-n-8 rounded p-4">
            <h3 className="text-sm font-medium text-n-1 mb-2">Debug Info:</h3>
            <div className="text-xs text-n-4 space-y-1">
              <p>• Check console for wallet detection</p>
              <p>• Look for MetaMask/Phantom status</p>
              <p>• Test connection functionality</p>
              <p>• Try direct MetaMask test button</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTest;
