'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchMyDIDs, createDID, deleteDID } from '@/store/slices/didSlice';
import Layout from '@/components/layout/Layout';

export default function DIDPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { dids, loading, error } = useSelector((state: RootState) => state.did);
  const [isCreating, setIsCreating] = useState(false);
  const [newDIDData, setNewDIDData] = useState({
    method: 'indy',
    network: 'sovrin',
    alias: '',
    country: 'Singapore',
  });

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      dispatch(fetchMyDIDs());
    }
  }, [isAuthenticated, authLoading, dispatch, router]);

  const handleCreateDID = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(createDID({
      ...newDIDData,
      useBlockchain: true,
      blockchain: newDIDData.method === 'ethereum' ? 'ethereum' : 
                 newDIDData.method === 'indy' ? 'hyperledger-indy' : 'hyperledger-fabric'
    }));
    if (createDID.fulfilled.match(resultAction)) {
      setIsCreating(false);
      setNewDIDData({
        method: 'indy',
        network: 'sovrin',
        alias: '',
        country: 'Singapore',
      });
    }
  };

  const handleDeleteDID = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this DID? This action cannot be undone.')) {
      await dispatch(deleteDID(id));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Decentralized Identifiers (DIDs)</h1>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isCreating ? 'Cancel' : 'Create New DID'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isCreating && (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New DID</h3>
                <form onSubmit={handleCreateDID} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="alias" className="block text-sm font-medium text-gray-700">
                      Alias (Name for your DID)
                    </label>
                    <input
                      type="text"
                      name="alias"
                      id="alias"
                      value={newDIDData.alias}
                      onChange={(e) => setNewDIDData({ ...newDIDData, alias: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                      DID Method
                    </label>
                    <select
                      id="method"
                      name="method"
                      value={newDIDData.method}
                      onChange={(e) => setNewDIDData({ ...newDIDData, method: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="indy">Hyperledger Indy</option>
                      <option value="ethr">Ethereum</option>
                      <option value="web">DID Web</option>
                      <option value="key">DID Key</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="network" className="block text-sm font-medium text-gray-700">
                      Network
                    </label>
                    <select
                      id="network"
                      name="network"
                      value={newDIDData.network}
                      onChange={(e) => setNewDIDData({ ...newDIDData, network: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="sovrin">Sovrin</option>
                      <option value="ethereum">Ethereum Mainnet</option>
                      <option value="rinkeby">Ethereum Rinkeby</option>
                      <option value="local">Local Network</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={newDIDData.country}
                      onChange={(e) => setNewDIDData({ ...newDIDData, country: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Singapore">Singapore</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                      >
                        {loading ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6">
            {loading && !isCreating ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading DIDs...</p>
              </div>
            ) : dids.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">You don't have any DIDs yet. Create one to get started.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {dids.map((did) => (
                    <li key={did.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-blue-600 truncate">{did.did}</p>
                          <p className="text-sm text-gray-500">{did.alias}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/did/${did.id}`)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteDID(did.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Method: {did.method}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Network: {did.network}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Country: {did.country}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
