'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ethers } from 'ethers';
import Layout from '@/components/layout/Layout';
import WalletConnect from '@/components/wallet/WalletConnect';

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleWalletConnect = async (address: string, web3Provider: ethers.providers.Web3Provider) => {
    setWalletAddress(address);
    setProvider(web3Provider);
    
    try {
      setIsLoading(true);
      
      // Get network information
      const network = await web3Provider.getNetwork();
      setNetwork(getNetworkName(network.chainId));
      
      // Get wallet balance
      const balanceWei = await web3Provider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
      
      // For demo purposes, we'll use mock transaction data
      // In a real app, you would fetch this from an API or blockchain explorer
      setTransactions(getMockTransactions(address));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setIsLoading(false);
    }
  };

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 3:
        return 'Ropsten Testnet';
      case 4:
        return 'Rinkeby Testnet';
      case 5:
        return 'Goerli Testnet';
      case 42:
        return 'Kovan Testnet';
      case 56:
        return 'Binance Smart Chain';
      case 137:
        return 'Polygon Mainnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const getMockTransactions = (address: string): any[] => {
    // Mock transaction data for demonstration
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: address,
        to: '0xdef1234567890abcdef1234567890abcdef123456',
        value: '0.05 ETH',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'Confirmed'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x7890abcdef1234567890abcdef1234567890abcdef',
        to: address,
        value: '0.1 ETH',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'Confirmed'
      },
      {
        hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
        from: address,
        to: '0x3456789abcdef1234567890abcdef1234567890abcdef',
        value: '0.02 ETH',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        status: 'Confirmed'
      }
    ];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Wallet Integration</h1>
          <p className="mt-2 text-gray-600">
            Connect your Ethereum wallet to interact with the QuantumTrust DPKI blockchain features.
          </p>

          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <WalletConnect onConnect={handleWalletConnect} />
            </div>
          </div>

          {walletAddress && provider && (
            <>
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Wallet Information</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p className="mt-2 text-gray-600">Loading wallet data...</p>
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Wallet Address</dt>
                          <dd className="mt-1 text-sm text-gray-900">{walletAddress}</dd>
                        </div>
                      </div>
                      <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Balance</dt>
                          <dd className="mt-1 text-3xl font-semibold text-gray-900">{balance} ETH</dd>
                        </div>
                      </div>
                      <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <dt className="text-sm font-medium text-gray-500 truncate">Network</dt>
                          <dd className="mt-1 text-sm text-gray-900">{network}</dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
                  
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <p className="mt-2 text-gray-600">Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No transactions found.</p>
                    </div>
                  ) : (
                    <div className="mt-5 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction Hash
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              From
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              To
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Timestamp
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((tx, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                {formatAddress(tx.hash)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatAddress(tx.from)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatAddress(tx.to)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {tx.value}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(tx.timestamp)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Link DID to Wallet</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Link your Decentralized Identifier (DID) to this Ethereum wallet for enhanced security and identity verification.
                    </p>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => router.push('/did')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Link DID to Wallet
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
