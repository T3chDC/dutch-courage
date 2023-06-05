// // This file is responsible for handling the state of the conversation data
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import conversationService from './conversationService'

const initialState = {
  conversation: null,
  conversations: [],

  isGetAllConversationsOfUserError: false,
  isGetAllConversationsOfUserSuccess: false,
  isGetAllConversationsOfUserLoading: false,
  getAllConversationsOfUserErrorMessage: '',

  isCreateConversationError: false,
  isCreateConversationSuccess: false,
  isCreateConversationLoading: false,
  createConversationErrorMessage: '',

  isGetConversationByIdError: false,
  isGetConversationByIdSuccess: false,
  isGetConversationByIdLoading: false,
  getConversationByIdErrorMessage: '',

  isDeleteConversationByIdError: false,
  isDeleteConversationByIdSuccess: false,
  isDeleteConversationByIdLoading: false,
  deleteConversationByIdErrorMessage: '',
}

//get all conversations for logged in user
export const getAllConversationsOfUser = createAsyncThunk(
  'conversation/getAllConversationsOfUser',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
      return await conversationService.getAllConversationsOfUser(token)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//create a new conversation
export const createConversation = createAsyncThunk(
  'conversation/createConversation',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
      return await conversationService.createConversation(token, data)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//get a conversation by id
export const getConversationById = createAsyncThunk(
  'conversation/getConversationById',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
      return await conversationService.getConversationById(
        token,
        conversationId
      )
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//delete a conversation by id
export const deleteConversationById = createAsyncThunk(
  'conversation/deleteConversationById',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
      return await conversationService.deleteConversationById(
        token,
        conversationId
      )
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    resetConversation: (state) => {
      state.conversation = null
    },
    resetConversations: (state) => {
      state.conversations = []
    },
    resetGetAllConversationsOfUser: (state) => {
      state.isGetAllConversationsOfUserError = false
      state.isGetAllConversationsOfUserSuccess = false
      state.isGetAllConversationsOfUserLoading = false
      state.getAllConversationsOfUserErrorMessage = ''
    },
    resetCreateConversation: (state) => {
      state.isCreateConversationError = false
      state.isCreateConversationSuccess = false
      state.isCreateConversationLoading = false
      state.createConversationErrorMessage = ''
    },
    resetGetConversationById: (state) => {
      state.isGetConversationByIdError = false
      state.isGetConversationByIdSuccess = false
      state.isGetConversationByIdLoading = false
      state.getConversationByIdErrorMessage = ''
    },
    resetDeleteConversationById: (state) => {
      state.isDeleteConversationByIdError = false
      state.isDeleteConversationByIdSuccess = false
      state.isDeleteConversationByIdLoading = false
      state.deleteConversationByIdErrorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllConversationsOfUser.pending, (state) => {
        state.isGetAllConversationsOfUserLoading = true
        state.isGetAllConversationsOfUserError = false
        state.isGetAllConversationsOfUserSuccess = false
        state.getAllConversationsOfUserErrorMessage = ''
      })
      .addCase(getAllConversationsOfUser.fulfilled, (state, action) => {
        state.isGetAllConversationsOfUserLoading = false
        state.isGetAllConversationsOfUserError = false
        state.isGetAllConversationsOfUserSuccess = true
        state.getAllConversationsOfUserErrorMessage = ''
        state.conversations = action.payload
      })
      .addCase(getAllConversationsOfUser.rejected, (state, action) => {
        state.isGetAllConversationsOfUserLoading = false
        state.isGetAllConversationsOfUserError = true
        state.isGetAllConversationsOfUserSuccess = false
        state.getAllConversationsOfUserErrorMessage = action.payload
      })
      .addCase(createConversation.pending, (state) => {
        state.isCreateConversationLoading = true
        state.isCreateConversationError = false
        state.isCreateConversationSuccess = false
        state.createConversationErrorMessage = ''
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.isCreateConversationLoading = false
        state.isCreateConversationError = false
        state.isCreateConversationSuccess = true
        state.createConversationErrorMessage = ''
        state.conversations.push(action.payload)
        state.conversation = action.payload
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.isCreateConversationLoading = false
        state.isCreateConversationError = true
        state.isCreateConversationSuccess = false
        state.createConversationErrorMessage = action.payload
      })
      .addCase(getConversationById.pending, (state) => {
        state.isGetConversationByIdLoading = true
        state.isGetConversationByIdError = false
        state.isGetConversationByIdSuccess = false
        state.getConversationByIdErrorMessage = ''
      })
      .addCase(getConversationById.fulfilled, (state, action) => {
        state.isGetConversationByIdLoading = false
        state.isGetConversationByIdError = false
        state.isGetConversationByIdSuccess = true
        state.getConversationByIdErrorMessage = ''
        state.conversation = action.payload
      })
      .addCase(getConversationById.rejected, (state, action) => {
        state.isGetConversationByIdLoading = false
        state.isGetConversationByIdError = true
        state.isGetConversationByIdSuccess = false
        state.getConversationByIdErrorMessage = action.payload
      })
      .addCase(deleteConversationById.pending, (state) => {
        state.isDeleteConversationByIdLoading = true
        state.isDeleteConversationByIdError = false
        state.isDeleteConversationByIdSuccess = false
        state.deleteConversationByIdErrorMessage = ''
      })
      .addCase(deleteConversationById.fulfilled, (state, action) => {
        state.isDeleteConversationByIdLoading = false
        state.isDeleteConversationByIdError = false
        state.isDeleteConversationByIdSuccess = true
        state.deleteConversationByIdErrorMessage = ''
        state.conversations = state.conversations.filter(
          (conversation) => conversation._id !== action.payload._id
        )
        state.conversation._id === action.payload._id && (state.conversation = null)
      })
      .addCase(deleteConversationById.rejected, (state, action) => {
        state.isDeleteConversationByIdLoading = false
        state.isDeleteConversationByIdError = true
        state.isDeleteConversationByIdSuccess = false
        state.deleteConversationByIdErrorMessage = action.payload
      })
  },
})

export const {
  resetConversation,
  resetConversations,
  resetGetAllConversationsOfUser,
  resetCreateConversation,
  resetGetConversationById,
  resetDeleteConversationById,
} = conversationSlice.actions

export default conversationSlice.reducer
