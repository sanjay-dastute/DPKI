'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, clearError } from '../../store/slices/authSlice';
import { AppDispatch, RootState } from '../../store';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [directLoginError, setDirectLoginError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if we already have a token in localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('Found existing auth data in localStorage');
      // Update Redux store with existing data
      dispatch({
        type: 'auth/login/fulfilled',
        payload: {
          token,
          user: JSON.parse(user)
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectLoginError(null);
    console.log('Form submitted with:', { username, password: password.replace(/./g, '*') });
    
    if (username.trim() && password.trim()) {
      try {
        console.log('Attempting login with credentials...');
        
        // For development/testing - simulate successful login for known users
        if ((username === 'admin' && password === 'Admin123!') || 
            (username === 'john_citizen' && password === 'Password123!') ||
            (username === 'sg_gov_health' && password === 'Password123!') ||
            (username === 'singapore_tech' && password === 'Password123!') ||
            (username === 'emma_tourist' && password === 'Password123!')) {
          
          console.log('DEV MODE: Simulating successful login for', username);
          
          // Determine role based on username
          let role = 'user';
          if (username === 'admin') role = 'admin';
          else if (username.startsWith('sg_gov_')) role = 'government';
          else if (username.includes('_tech') || username.includes('_finance')) role = 'business';
          else if (username.includes('_tourist')) role = 'tourist';
          else role = 'individual';
          
          // Create a mock token and user
          const mockToken = 'mock-jwt-token-for-development';
          const mockUser = {
            id: `${username}-id`,
            username,
            email: `${username}@quantumtrust.com`,
            role,
            isActive: true,
            isVerified: true
          };
          
          // Store in localStorage
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          // Update Redux store
          dispatch({
            type: 'auth/login/fulfilled',
            payload: {
              token: mockToken,
              user: mockUser
            }
          });
          
          console.log('DEV MODE: Mock authentication successful, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }
        
        // Try direct fetch with better error handling
        try {
          const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include', // Include cookies if needed
          });
          
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Login response data:', data);
            
            if (data.access_token) {
              // Store token and user data
              localStorage.setItem('token', data.access_token);
              
              // Store user data if available, or create a minimal user object
              if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
              } else {
                // Create minimal user object if not provided by backend
                const minimalUser = {
                  username,
                  id: 'temp-id', // Will be replaced when fetchCurrentUser is called
                  role: 'user',  // Default role
                };
                localStorage.setItem('user', JSON.stringify(minimalUser));
              }
              
              // Update Redux store manually
              dispatch({
                type: 'auth/login/fulfilled',
                payload: {
                  token: data.access_token,
                  user: data.user || { username, id: 'temp-id', role: 'user' }
                }
              });
              
              console.log('Authentication successful, redirecting to dashboard');
              router.push('/dashboard');
              return;
            } else {
              console.error('No access token in response');
              setDirectLoginError('Authentication failed. No access token received.');
            }
          } else {
            // Try to parse error response
            let errorMessage = 'Login failed. Please check your credentials.';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // If response is not JSON, try to get text
              try {
                const errorText = await response.text();
                if (errorText) errorMessage = errorText;
              } catch (e2) {
                // Ignore if we can't get text either
              }
            }
            
            setDirectLoginError(errorMessage);
            console.error('Login failed:', errorMessage);
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          setDirectLoginError('Network error. Please check if the server is running.');
        }
      } catch (error) {
        console.error('Error during login process:', error);
        setDirectLoginError('An unexpected error occurred. Please try again.');
      }
    } else {
      setDirectLoginError('Please enter both username and password.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">Login to QuantumTrust DPKI</h2>
      
      {(error || directLoginError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          <span className="block sm:inline">{error || directLoginError}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => {
              dispatch(clearError());
              setDirectLoginError(null);
            }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link href="/auth/register" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </div>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
