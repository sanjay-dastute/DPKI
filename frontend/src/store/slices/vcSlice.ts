import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

// Define types
interface VerifiableCredential {
  id: string;
  credentialId: string;
  issuer: string;
  holder: string;
  type: string[];
  issuanceDate: Date;
  expirationDate?: Date;
  status?: string;
  proof?: string;
  schema?: string;
  credentialDefinitionId?: string;
  revocationRegistryId?: string;
  credentialRevocationId?: string;
  blockchain?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VCState {
  credentials: VerifiableCredential[];
  issuedCredentials: VerifiableCredential[];
  currentCredential: VerifiableCredential | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: VCState = {
  credentials: [],
  issuedCredentials: [],
  currentCredential: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMyCredentials = createAsyncThunk(
  'vc/fetchMyCredentials',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.get('/api/verifiable-credentials/my-credentials', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch credentials');
    }
  }
);

export const fetchMyIssuedCredentials = createAsyncThunk(
  'vc/fetchMyIssuedCredentials',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.get('/api/verifiable-credentials/my-issued-credentials', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issued credentials');
    }
  }
);

export const createCredential = createAsyncThunk(
  'vc/createCredential',
  async (credentialData: Partial<VerifiableCredential>, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post('/api/verifiable-credentials', credentialData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create credential');
    }
  }
);

export const verifyCredential = createAsyncThunk(
  'vc/verifyCredential',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post(`/api/verifiable-credentials/${id}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return { id, verified: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify credential');
    }
  }
);

export const revokeCredential = createAsyncThunk(
  'vc/revokeCredential',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      await axios.post(`/api/verifiable-credentials/${id}/revoke`, {}, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to revoke credential');
    }
  }
);

// Slice
const vcSlice = createSlice({
  name: 'vc',
  initialState,
  reducers: {
    setCurrentCredential: (state, action: PayloadAction<VerifiableCredential | null>) => {
      state.currentCredential = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my credentials
      .addCase(fetchMyCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCredentials.fulfilled, (state, action: PayloadAction<VerifiableCredential[]>) => {
        state.loading = false;
        state.credentials = action.payload;
      })
      .addCase(fetchMyCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch my issued credentials
      .addCase(fetchMyIssuedCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyIssuedCredentials.fulfilled, (state, action: PayloadAction<VerifiableCredential[]>) => {
        state.loading = false;
        state.issuedCredentials = action.payload;
      })
      .addCase(fetchMyIssuedCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create credential
      .addCase(createCredential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCredential.fulfilled, (state, action: PayloadAction<VerifiableCredential>) => {
        state.loading = false;
        state.issuedCredentials.push(action.payload);
        state.currentCredential = action.payload;
      })
      .addCase(createCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify credential
      .addCase(verifyCredential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCredential.fulfilled, (state, action: PayloadAction<{ id: string; verified: boolean }>) => {
        state.loading = false;
        // Update the credential in the appropriate list
        const credentialIndex = state.credentials.findIndex(cred => cred.id === action.payload.id);
        if (credentialIndex !== -1) {
          state.credentials[credentialIndex].status = action.payload.verified ? 'verified' : 'invalid';
        }
        
        const issuedCredentialIndex = state.issuedCredentials.findIndex(cred => cred.id === action.payload.id);
        if (issuedCredentialIndex !== -1) {
          state.issuedCredentials[issuedCredentialIndex].status = action.payload.verified ? 'verified' : 'invalid';
        }
        
        if (state.currentCredential?.id === action.payload.id) {
          state.currentCredential.status = action.payload.verified ? 'verified' : 'invalid';
        }
      })
      .addCase(verifyCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revoke credential
      .addCase(revokeCredential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeCredential.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Update the credential status in the appropriate list
        const credentialIndex = state.credentials.findIndex(cred => cred.id === action.payload);
        if (credentialIndex !== -1) {
          state.credentials[credentialIndex].status = 'revoked';
        }
        
        const issuedCredentialIndex = state.issuedCredentials.findIndex(cred => cred.id === action.payload);
        if (issuedCredentialIndex !== -1) {
          state.issuedCredentials[issuedCredentialIndex].status = 'revoked';
        }
        
        if (state.currentCredential?.id === action.payload) {
          state.currentCredential.status = 'revoked';
        }
      })
      .addCase(revokeCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentCredential, clearError } = vcSlice.actions;
export default vcSlice.reducer;
