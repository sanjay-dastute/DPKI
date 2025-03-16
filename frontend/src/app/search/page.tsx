'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Layout from '../../components/layout/Layout';

export default function SearchPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('did');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // Check if user is business or government
  const isBusinessOrGovernment = user?.role === 'BUSINESS' || user?.role === 'GOVERNMENT' || user?.role === 'ADMIN';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    setIsSearching(true);
    setError('');
    setSearchResults([]);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        
        if (data.length === 0) {
          setError('No results found');
        }
      } else {
        throw new Error('Failed to perform search');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      
      // For demo purposes, use mock data
      if (searchType === 'did') {
        setSearchResults([
          { id: '1', did: 'did:indy:sovrin:123456789abcdef', method: 'indy', owner: { username: 'user1', country: 'Singapore' } },
          { id: '2', did: 'did:ethr:0x1234567890abcdef', method: 'ethr', owner: { username: 'user2', country: 'Saudi Arabia' } },
        ]);
      } else if (searchType === 'credential') {
        setSearchResults([
          { id: '1', type: 'IdentityCredential', issuer: 'did:indy:sovrin:issuer123', holder: { username: 'user1', country: 'Singapore' } },
          { id: '2', type: 'EducationCredential', issuer: 'did:ethr:0xissuer456', holder: { username: 'user2', country: 'Saudi Arabia' } },
        ]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  if (!isAuthenticated || loading) {
    return null;
  }

  if (!isBusinessOrGovernment) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
            <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">
                This feature is only available for business and government users.
              </span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Search</h1>
          
          <div className="mt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="w-full sm:w-1/4">
                  <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">
                    Search Type
                  </label>
                  <select
                    id="searchType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="did">DID</option>
                    <option value="credential">Credential</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div className="w-full sm:w-3/4 mt-4 sm:mt-0">
                  <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700">
                    Search Query
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="searchQuery"
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder={`Enter ${searchType} ID, name, or keyword`}
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isSearching}
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
              
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {searchType === 'did' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Owner
                          </th>
                        </>
                      )}
                      
                      {searchType === 'credential' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Issuer
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Holder
                          </th>
                        </>
                      )}
                      
                      {searchType === 'document' && (
                        <>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filename
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Owner
                          </th>
                        </>
                      )}
                      
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((result: any) => (
                      <tr key={result.id}>
                        {searchType === 'did' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.did.substring(0, 20)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.method}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.owner?.username || 'Unknown'} ({result.owner?.country || 'Unknown'})
                            </td>
                          </>
                        )}
                        
                        {searchType === 'credential' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.issuer.substring(0, 15)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.holder?.username || 'Unknown'} ({result.holder?.country || 'Unknown'})
                            </td>
                          </>
                        )}
                        
                        {searchType === 'document' && (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.filename || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.documentType || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.owner?.username || 'Unknown'} ({result.owner?.country || 'Unknown'})
                            </td>
                          </>
                        )}
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => router.push(`/${searchType}s/${result.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
