'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchMyDocuments, uploadDocument, verifyDocument, deleteDocument } from '@/store/slices/documentSlice';
import Layout from '@/components/layout/Layout';

export default function DocumentsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { documents, loading, error } = useSelector((state: RootState) => state.document);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentData, setDocumentData] = useState({
    documentType: 'identity',
    country: 'Singapore',
    organization: '',
  });

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      dispatch(fetchMyDocuments());
    }
  }, [isAuthenticated, authLoading, dispatch, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const resultAction = await dispatch(uploadDocument({ formData, documentData }));
    if (uploadDocument.fulfilled.match(resultAction)) {
      setIsUploading(false);
      setFile(null);
      setDocumentData({
        documentType: 'identity',
        country: 'Singapore',
        organization: '',
      });
    }
  };

  const handleVerifyDocument = async (id: string) => {
    await dispatch(verifyDocument(id));
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      await dispatch(deleteDocument(id));
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
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isUploading ? 'Cancel' : 'Upload Document'}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isUploading && (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upload New Document</h3>
                <form onSubmit={handleUploadDocument} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                      Document File
                    </label>
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Supported file types: PDF, JPG, PNG, DOCX
                    </p>
                  </div>

                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                      Document Type
                    </label>
                    <select
                      id="documentType"
                      name="documentType"
                      value={documentData.documentType}
                      onChange={(e) => setDocumentData({ ...documentData, documentType: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="identity">Identity Document</option>
                      <option value="passport">Passport</option>
                      <option value="drivingLicense">Driving License</option>
                      <option value="residencePermit">Residence Permit</option>
                      <option value="businessRegistration">Business Registration</option>
                      <option value="taxDocument">Tax Document</option>
                      <option value="medicalRecord">Medical Record</option>
                      <option value="educationCertificate">Education Certificate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={documentData.country}
                      onChange={(e) => setDocumentData({ ...documentData, country: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="Singapore">Singapore</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      id="organization"
                      value={documentData.organization}
                      onChange={(e) => setDocumentData({ ...documentData, organization: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Ministry of Home Affairs"
                    />
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsUploading(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading || !file}
                      >
                        {loading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6">
            {loading && !isUploading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-2 text-gray-600">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">You don't have any documents yet. Upload one to get started.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {documents.map((document) => (
                    <li key={document.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-blue-600 truncate">{document.filename}</p>
                          <p className="text-sm text-gray-500">Type: {document.documentType}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerifyDocument(document.id)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                              document.isVerified ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            {document.isVerified ? 'Verified' : 'Verify'}
                          </button>
                          <button
                            onClick={() => router.push(`/documents/${document.id}`)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(document.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Country: {document.country || 'Not specified'}
                          </p>
                          {document.organization && (
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              Organization: {document.organization}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Uploaded: {formatDate(document.createdAt.toString())}
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
