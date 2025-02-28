import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

// Define types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  country?: string;
  organization?: string;
  isActive: boolean;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initialize state from localStorage if available
const getUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e);
    return null;
  }
};

// Initial state
const initialState: AuthState = {
  user: getUserFromStorage(),
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', { username });
      
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
        
        return {
          access_token: mockToken,
          user: mockUser
        };
      }
      
      // Try real backend login
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      // Store token and user data in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Note: Backend registration endpoint needs to be implemented
      const response = await axios.post('http://localhost:3000/auth/register', userData);
      
      // Store token and user data in localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      // If we don't have a token, check localStorage
      const token = auth.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      console.log('Fetching current user with token:', token);
      const response = await axios.get('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Current user response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      
      // For development/testing - if we have a user in localStorage, use that
      if (typeof window !== 'undefined') {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            console.log('DEV MODE: Using user from localStorage:', user);
            return user;
          } catch (e) {
            console.error('Failed to parse user from localStorage:', e);
          }
        }
      }
      
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add a manual login action for direct manipulation
    manualLogin: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // Handle the response format from the backend
        if (action.payload.access_token) {
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        
        // Handle the response format from the backend
        if (action.payload.access_token) {
          state.token = action.payload.access_token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        
        // Only clear authentication if we're not in development mode
        if (!state.user || !state.token) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      });
  },
});

export const { logout, clearError, manualLogin } = authSlice.actions;
export default authSlice.reducer;
