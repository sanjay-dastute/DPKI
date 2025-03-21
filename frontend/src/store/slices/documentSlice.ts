import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '..';

// Define types
interface Document {
  id: string;
  filename: string;
  owner: string;
  documentType: string;
  mimeType?: string;
  hash?: string;
  ipfsHash?: string;
  encryptionKey?: string;
  encryptionAlgorithm?: string;
  isVerified: boolean;
  verificationMethod?: string;
  verificationResult?: string;
  aiVerificationResult?: {
    verified: boolean;
    confidence: number;
    details: Record<string, any>;
  };
  country?: string;
  organization?: string;
  createdAt: Date;
  updatedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  blockchain?: string;
  transactionId?: string;
  blockchainTxHash?: string;
  status?: 'pending' | 'verified' | 'rejected';
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: DocumentState = {
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMyDocuments = createAsyncThunk(
  'document/fetchMyDocuments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.get('/api/documents/my-documents', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

export const shareDocument = createAsyncThunk(
  'document/shareDocument',
  async ({ documentId, recipientId, permissions }: { documentId: string; recipientId: string; permissions: string[] }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post(`/api/documents/${documentId}/share`, {
        recipientId,
        permissions,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share document');
    }
  }
);

export const rejectDocument = createAsyncThunk(
  'document/rejectDocument',
  async ({ documentId, reason }: { documentId: string; reason: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post(`/api/documents/${documentId}/reject`, {
        reason,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject document');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'document/uploadDocument',
  async ({ formData, documentData }: { formData: FormData; documentData: Partial<Document> }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      
      // Add encryption option to formData if not already present
      if (!formData.has('encrypt')) {
        formData.append('encrypt', 'true');
      }
      
      // First upload the file to IPFS with encryption
      const uploadResponse = await axios.post('/api/documents/upload', formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Then create the document record with the file info
      const documentResponse = await axios.post('/api/documents', {
        ...documentData,
        filename: uploadResponse.data.filename,
        hash: uploadResponse.data.hash,
        ipfsHash: uploadResponse.data.ipfsHash,
        encryptionKey: uploadResponse.data.encryptionKey,
        encryptionAlgorithm: uploadResponse.data.encryptionAlgorithm || 'AES-256-CBC',
        blockchain: documentData.blockchain || 'ethereum',
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      
      return documentResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const verifyDocument = createAsyncThunk(
  'document/verifyDocument',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      const response = await axios.post(`/api/documents/${id}/verify`, {
        useAI: true,
        useBlockchain: true,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'document/deleteDocument',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;
      await axios.delete(`/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: {
          unpinFromIpfs: true,
          updateBlockchain: true,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete document');
    }
  }
);

// Slice
const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setCurrentDocument: (state, action: PayloadAction<Document | null>) => {
      state.currentDocument = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch documents
      .addCase(fetchMyDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchMyDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action: PayloadAction<Document>) => {
        state.loading = false;
        state.documents.push(action.payload);
        state.currentDocument = action.payload;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify document
      .addCase(verifyDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyDocument.fulfilled, (state, action: PayloadAction<Document>) => {
        state.loading = false;
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(verifyDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
        if (state.currentDocument?.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Share document
      .addCase(shareDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareDocument.fulfilled, (state, action: PayloadAction<Document>) => {
        state.loading = false;
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(shareDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reject document
      .addCase(rejectDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectDocument.fulfilled, (state, action: PayloadAction<Document>) => {
        state.loading = false;
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        if (state.currentDocument?.id === action.payload.id) {
          state.currentDocument = action.payload;
        }
      })
      .addCase(rejectDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentDocument, clearError } = documentSlice.actions;
export default documentSlice.reducer;
