'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Layout from '@/components/layout/Layout';
import DataVisualization from '@/components/analytics/DataVisualization';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('usage');

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Mock data for charts
  const usageData = [
    { name: 'Jan', dids: 4, credentials: 2, documents: 3 },
    { name: 'Feb', dids: 7, credentials: 5, documents: 6 },
    { name: 'Mar', dids: 10, credentials: 8, documents: 9 },
    { name: 'Apr', dids: 15, credentials: 12, documents: 14 },
    { name: 'May', dids: 20, credentials: 18, documents: 16 },
    { name: 'Jun', dids: 25, credentials: 22, documents: 20 },
  ];

  const countryData = [
    { name: 'Singapore', value: 65 },
    { name: 'Saudi Arabia', value: 35 },
  ];

  const documentTypeData = [
    { name: 'Identity', value: 30 },
    { name: 'Passport', value: 20 },
    { name: 'Driving License', value: 15 },
    { name: 'Business Registration', value: 10 },
    { name: 'Residence Permit', value: 10 },
    { name: 'Education Certificate', value: 8 },
    { name: 'Medical Record', value: 7 },
  ];

  const verificationStatusData = [
    { name: 'Jan', verified: 2, pending: 1, rejected: 0 },
    { name: 'Feb', verified: 4, pending: 2, rejected: 1 },
    { name: 'Mar', verified: 6, pending: 3, rejected: 1 },
    { name: 'Apr', verified: 10, pending: 4, rejected: 2 },
    { name: 'May', verified: 15, pending: 5, rejected: 2 },
    { name: 'Jun', verified: 18, pending: 4, rejected: 3 },
  ];

  const userRoleData = [
    { name: 'Individual', value: 45 },
    { name: 'Business', value: 25 },
    { name: 'Government', value: 20 },
    { name: 'Admin', value: 10 },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Visualize and analyze data from the QuantumTrust DPKI platform.
          </p>

          <div className="mt-4">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value="usage">Usage Metrics</option>
                <option value="demographics">Demographics</option>
                <option value="verification">Verification Status</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('usage')}
                    className={`${
                      activeTab === 'usage'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Usage Metrics
                  </button>
                  <button
                    onClick={() => setActiveTab('demographics')}
                    className={`${
                      activeTab === 'demographics'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Demographics
                  </button>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className={`${
                      activeTab === 'verification'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Verification Status
                  </button>
                  <button
                    onClick={() => setActiveTab('compliance')}
                    className={`${
                      activeTab === 'compliance'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Compliance
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            {activeTab === 'usage' && (
              <>
                <DataVisualization
                  type="line"
                  data={usageData}
                  title="Platform Usage Over Time"
                  description="Monthly growth of DIDs, Verifiable Credentials, and Documents"
                  dataKeys={['dids', 'credentials', 'documents']}
                  colors={['#8884d8', '#82ca9d', '#ffc658']}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataVisualization
                    type="pie"
                    data={documentTypeData}
                    title="Document Types Distribution"
                    description="Breakdown of document types in the system"
                    dataKeys={['value']}
                    colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']}
                  />
                  
                  <DataVisualization
                    type="pie"
                    data={userRoleData}
                    title="User Roles Distribution"
                    description="Breakdown of user roles in the system"
                    dataKeys={['value']}
                    colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
                  />
                </div>
              </>
            )}

            {activeTab === 'demographics' && (
              <>
                <DataVisualization
                  type="pie"
                  data={countryData}
                  title="Country Distribution"
                  description="Distribution of users by country"
                  dataKeys={['value']}
                  colors={['#0088FE', '#00C49F']}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Singapore User Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-blue-600">65</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">DIDs Created</p>
                        <p className="text-2xl font-bold text-blue-600">112</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Credentials Issued</p>
                        <p className="text-2xl font-bold text-blue-600">87</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Documents Verified</p>
                        <p className="text-2xl font-bold text-blue-600">73</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Saudi Arabia User Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-green-600">35</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">DIDs Created</p>
                        <p className="text-2xl font-bold text-green-600">58</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Credentials Issued</p>
                        <p className="text-2xl font-bold text-green-600">42</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Documents Verified</p>
                        <p className="text-2xl font-bold text-green-600">31</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'verification' && (
              <>
                <DataVisualization
                  type="bar"
                  data={verificationStatusData}
                  title="Document Verification Status Over Time"
                  description="Monthly breakdown of document verification statuses"
                  dataKeys={['verified', 'pending', 'rejected']}
                  colors={['#82ca9d', '#ffc658', '#ff8042']}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Success Rate</h3>
                    <div className="flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#82ca9d"
                            strokeWidth="3"
                            strokeDasharray="85, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">85%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Average Verification Time</h3>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">2.4</p>
                        <p className="text-sm text-gray-500">hours</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Assisted Verifications</h3>
                    <div className="flex items-center justify-center">
                      <div className="relative h-32 w-32">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#eee"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#8884d8"
                            strokeWidth="3"
                            strokeDasharray="72, 100"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-900">72%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'compliance' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">GDPR Compliance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Data Consent</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Right to Access</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Right to be Forgotten</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Data Portability</span>
                          <span className="text-sm font-medium text-green-600">95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">HIPAA Compliance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Privacy Safeguards</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Security Measures</span>
                          <span className="text-sm font-medium text-green-600">98%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Audit Controls</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Breach Notification</span>
                          <span className="text-sm font-medium text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Regulatory Compliance by Country</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Singapore</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">PDPA Compliance</span>
                            <span className="text-sm font-medium text-green-600">100%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Digital Identity Framework</span>
                            <span className="text-sm font-medium text-green-600">98%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Saudi Arabia</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">PDPL Compliance</span>
                            <span className="text-sm font-medium text-green-600">97%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '97%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">National Data Governance Regulations</span>
                            <span className="text-sm font-medium text-green-600">95%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
