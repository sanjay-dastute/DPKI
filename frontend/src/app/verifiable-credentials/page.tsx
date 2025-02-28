'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchMyCredentials, createCredential, deleteCredential } from '@/store/slices/vcSlice';
import { fetchMyDIDs } from '@/store/slices/didSlice';
import Layout from '@/components/layout/Layout';

export default function VerifiableCredentialsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { credentials, loading, error } = useSelector((state: RootState) => state.vc);
  const { dids } = useSelector((state: RootState) => state.did);
  const [isCreating, setIsCreating] = useState(false);
  const [newCredentialData, setNewCredentialData] = useState({
    type: 'IdentityCredential',
    didId: '',
    issuer: '',
    subject: '',
    claims: '',
    expirationDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      dispatch(fetchMyCredentials());
      dispatch(fetchMyDIDs());
    }
  }, [isAuthenticated, authLoading, dispatch, router]);

  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format claims as JSON object
    let formattedClaims;
    try {
      formattedClaims = JSON.parse(newCredentialData.claims);
    } catch (error) {
      alert('Claims must be valid JSON. Please check your format.');
      return;
    }
    
    const credentialData = {
      ...newCredentialData,
      claims: formattedClaims,
    };
    
    const resultAction = await dispatch(createCredential(credentialData));
    if (createCredential.fulfilled.match(resultAction)) {
      setIsCreating(false);
      setNewCredentialData({
        type: 'IdentityCredential',
        didId: '',
        issuer: '',
        subject: '',
        claims: '',
        expirationDate: '',
      });
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this credential? This action cannot be undone.')) {
      await dispatch(deleteCredential(id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Verifiable Credentials</h1>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isCreating ? 'Cancel' : 'Create New Credential'}
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Verifiable Credential</h3>
                <form onSubmit={handleCreateCredential} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Credential Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newCredentialData.type}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, type: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="IdentityCredential">Identity Credential</option>
                      <option value="EducationCredential">Education Credential</option>
                      <option value="EmploymentCredential">Employment Credential</option>
                      <option value="HealthCredential">Health Credential</option>
                      <option value="ResidencyCredential">Residency Credential</option>
                      <option value="BusinessCredential">Business Credential</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="didId" className="block text-sm font-medium text-gray-700">
                      Associated DID
                    </label>
                    <select
                      id="didId"
                      name="didId"
                      value={newCredentialData.didId}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, didId: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select a DID</option>
                      {dids.map((did) => (
                        <option key={did.id} value={did.id}>
                          {did.alias} ({did.did})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                      Issuer
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      id="issuer"
                      value={newCredentialData.issuer}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, issuer: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="did:example:issuer123"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={newCredentialData.subject}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, subject: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="did:example:subject456"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="claims" className="block text-sm font-medium text-gray-700">
                      Claims (JSON format)
                    </label>
                    <textarea
                      id="claims"
                      name="claims"
                      rows={4}
                      value={newCredentialData.claims}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, claims: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder='{"name": "John Doe", "age": 30, "country": "Singapore"}'
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter claims in valid JSON format. Example: {`{"name": "John Doe", "age": 30}`}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expirationDate"
                      id="expirationDate"
                      value={newCredentialData.expirationDate}
                      onChange={(e) => setNewCredentialData({ ...newCredentialData, expirationDate: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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
                <p className="mt-2 text-gray-600">Loading credentials...</p>
              </div>
            ) : credentials.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">You don't have any verifiable credentials yet. Create one to get started.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {credentials.map((credential) => (
                    <li key={credential.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-blue-600 truncate">{credential.type}</p>
                          <p className="text-sm text-gray-500">ID: {credential.id.substring(0, 8)}...</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/verifiable-credentials/${credential.id}`)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteCredential(credential.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Issuer: {credential.issuer.substring(0, 15)}...
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Subject: {credential.subject.substring(0, 15)}...
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          {credential.expirationDate && (
                            <p>
                              Expires: {formatDate(credential.expirationDate)}
                            </p>
                          )}
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
