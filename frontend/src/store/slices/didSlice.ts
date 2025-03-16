import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

// Define types
interface DID {
  id: string;
  did: string;
  controller: string;
  verificationMethod?: string;
  publicKey?: string;
  type?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  blockchain?: string;
  transactionId?: string;
  blockchainTxHash?: string;
  verkey?: string;
  alias?: string;
  method?: 'indy' | 'ethereum' | 'fabric';
  network?: string;
  country?: string;
}

interface DIDState {
  dids: DID[];
  currentDID: DID | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DIDState = {
  dids: [],
  currentDID: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMyDIDs = createAsyncThunk(
  'did/fetchMyDIDs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.get('/api/did/my-dids', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch DIDs');
    }
  }
);

export const createDID = createAsyncThunk(
  'did/createDID',
  async (didData: Partial<DID> & { useBlockchain?: boolean }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      // Add blockchain options if not already present
      const enhancedDidData = {
        ...didData,
        useBlockchain: didData.useBlockchain !== false,
        blockchain: didData.blockchain || 'ethereum',
        method: didData.method || 'ethereum',
      };
      
      const response = await axios.post('/api/did', enhancedDidData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create DID');
    }
  }
);

export const updateDID = createAsyncThunk(
  'did/updateDID',
  async ({ id, ...didData }: Partial<DID> & { id: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.put(`/api/did/${id}`, didData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update DID');
    }
  }
);

export const deleteDID = createAsyncThunk(
  'did/deleteDID',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      await axios.delete(`/api/did/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete DID');
    }
  }
);

// Slice
const didSlice = createSlice({
  name: 'did',
  initialState,
  reducers: {
    setCurrentDID: (state, action: PayloadAction<DID | null>) => {
      state.currentDID = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch DIDs
      .addCase(fetchMyDIDs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDIDs.fulfilled, (state, action: PayloadAction<DID[]>) => {
        state.loading = false;
        state.dids = action.payload;
      })
      .addCase(fetchMyDIDs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create DID
      .addCase(createDID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDID.fulfilled, (state, action: PayloadAction<DID>) => {
        state.loading = false;
        state.dids.push(action.payload);
        state.currentDID = action.payload;
      })
      .addCase(createDID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update DID
      .addCase(updateDID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDID.fulfilled, (state, action: PayloadAction<DID>) => {
        state.loading = false;
        const index = state.dids.findIndex((did) => did.id === action.payload.id);
        if (index !== -1) {
          state.dids[index] = action.payload;
        }
        if (state.currentDID?.id === action.payload.id) {
          state.currentDID = action.payload;
        }
      })
      .addCase(updateDID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete DID
      .addCase(deleteDID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDID.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.dids = state.dids.filter((did) => did.id !== action.payload);
        if (state.currentDID?.id === action.payload) {
          state.currentDID = null;
        }
      })
      .addCase(deleteDID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentDID, clearError } = didSlice.actions;
export default didSlice.reducer;
