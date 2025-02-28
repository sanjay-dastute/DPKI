'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  onConnect?: (address: string, provider: ethers.providers.Web3Provider) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            
            if (onConnect) {
              onConnect(accounts[0], web3Provider);
            }
          }
        } catch (err: any) {
          console.error('Error checking wallet connection:', err);
          setError('Error checking wallet connection');
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          setIsConnected(false);
          setWalletAddress(null);
          setProvider(null);
        } else {
          // Account changed
          setWalletAddress(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Handle chain change - refresh provider
        if (isConnected) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          if (onConnect && walletAddress) {
            onConnect(walletAddress, web3Provider);
          }
        }
      });
    }

    return () => {
      // Clean up listeners
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [onConnect, isConnected, walletAddress]);

  const connectWallet = async () => {
    setError(null);
    
    if (typeof window.ethereum === 'undefined') {
      setError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      
      setProvider(web3Provider);
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      
      if (onConnect) {
        onConnect(accounts[0], web3Provider);
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Error connecting wallet');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setProvider(null);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}

      {isConnected && walletAddress ? (
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {formatAddress(walletAddress)}
          </div>
          <button
            onClick={disconnectWallet}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
