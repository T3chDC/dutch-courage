// // This file is responsible for handling the state of the message data
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import messageService from './messageService'

const initialState = {
  message: null,
  messages: [],

  isCreateMessageError: false,
  isCreateMessageSuccess: false,
  isCreateMessageLoading: false,
  createMessageErrorMessage: '',

  isDeleteMessageByIdError: false,
  isDeleteMessageByIdSuccess: false,
  isDeleteMessageByIdLoading: false,
  deleteMessageByIdErrorMessage: '',
}

//create a new message
export const createMessage = createAsyncThunk(
  'message/createMessage',
  async (data, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await messageService.createMessage(token, data)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//delete a message by id
export const deleteMessageById = createAsyncThunk(
  'message/deleteMessageById',
  async (id, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await messageService.deleteMessageById(token, id)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null
    },
    resetMessages: (state) => {
      state.messages = []
    },
    resetCreateMessage: (state) => {
      state.isCreateMessageError = false
      state.isCreateMessageSuccess = false
      state.isCreateMessageLoading = false
      state.createMessageErrorMessage = ''
    },
    resetDeleteMessageById: (state) => {
      state.isDeleteMessageByIdError = false
      state.isDeleteMessageByIdSuccess = false
      state.isDeleteMessageByIdLoading = false
      state.deleteMessageByIdErrorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMessage.pending, (state) => {
        state.isCreateMessageLoading = true
        state.isCreateMessageError = false
        state.isCreateMessageSuccess = false
        state.createMessageErrorMessage = ''
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isCreateMessageLoading = false
        state.isCreateMessageError = false
        state.isCreateMessageSuccess = true
        state.createMessageErrorMessage = ''
        state.messages.push(action.payload)
        state.message = action.payload
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isCreateMessageLoading = false
        state.isCreateMessageError = true
        state.isCreateMessageSuccess = false
        state.createMessageErrorMessage = action.payload
      })
      .addCase(deleteMessageById.pending, (state) => {
        state.isDeleteMessageByIdLoading = true
        state.isDeleteMessageByIdError = false
        state.isDeleteMessageByIdSuccess = false
        state.deleteMessageByIdErrorMessage = ''
      })
      .addCase(deleteMessageById.fulfilled, (state, action) => {
        state.isDeleteMessageByIdLoading = false
        state.isDeleteMessageByIdError = false
        state.isDeleteMessageByIdSuccess = true
        state.deleteMessageByIdErrorMessage = ''
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload._id
        )
        state.message._id === action.payload._id && (state.message = null)
      })
      .addCase(deleteMessageById.rejected, (state, action) => {
        state.isDeleteMessageByIdLoading = false
        state.isDeleteMessageByIdError = true
        state.isDeleteMessageByIdSuccess = false
        state.deleteMessageByIdErrorMessage = action.payload
      })
  },
})

export const {
  resetMessage,
  resetMessages,
  resetCreateMessage,
  resetDeleteMessageById,
} = messageSlice.actions

export default messageSlice.reducer
