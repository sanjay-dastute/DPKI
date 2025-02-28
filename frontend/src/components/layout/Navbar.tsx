'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary-700 text-white' : 'text-gray-300 hover:bg-primary-700 hover:text-white';
  };

  return (
    <nav className="bg-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-white font-bold text-xl">QuantumTrust DPKI</span>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}>
                    Dashboard
                  </Link>
                  <Link href="/did" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/did')}`}>
                    DIDs
                  </Link>
                  <Link href="/verifiable-credentials" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/verifiable-credentials')}`}>
                    Credentials
                  </Link>
                  <Link href="/documents" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/documents')}`}>
                    Documents
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link href="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin')}`}>
                      Admin
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <span className="text-gray-300 mr-4">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-primary-700 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/auth/login" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/auth/login')}`}>
                    Login
                  </Link>
                  <Link href="/auth/register" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/auth/register')}`}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
