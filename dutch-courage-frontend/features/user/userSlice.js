// This file is responsible for handling the state of the user data
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
  meUser: null,
  otherUser: null,
  isMeGetError: false,
  isMeGetSuccess: false,
  isMeGetLoading: false,
  meGetErrorMessage: '',
  isMeUpdateError: false,
  isMeUpdateSuccess: false,
  isMeUpdateLoading: false,
  meUpdateErrorMessage: '',
  isOtherGetError: false,
  isOtherGetSuccess: false,
  isOtherGetLoading: false,
  otherGetErrorMessage: '',
  isBlockUserError: false,
  isBlockUserSuccess: false,
  isBlockUserLoading: false,
  blockUserErrorMessage: '',

  isRateUserError: false,
  isRateUserSuccess: false,
  isRateUserLoading: false,
  rateUserErrorMessage: '',
}

//get info about logged in user
export const getMeUser = createAsyncThunk(
  'user/getMeUser',
  async (_, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await userService.getMeUser(token)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get info about a user by id
export const getOtherUser = createAsyncThunk(
  'user/getOtherUser',
  async (id, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await userService.getOtherUser(token, id)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//update info about logged in user
export const updateMeUser = createAsyncThunk(
  'user/updateMeUser',
  async (userData, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await userService.updateMeUser(token, userData)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Block another user with reason
export const blockUser = createAsyncThunk(
  'user/blockUser',
  async (data, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await userService.blockUser(token, data)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Rate another user with reason
export const rateUser = createAsyncThunk(
  'user/rateUser',
  async (data, thunkAPI) => {
    try {
      if (!thunkAPI.getState().auth.userInfo) {
        return
      }
      const token = thunkAPI.getState().auth.userInfo.token
      if (!token) {
        return thunkAPI.rejectWithValue('Token not found')
      }
      return await userService.rateUser(token, data)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetMeUser: (state) => {
      state.meUser = null
      state.isMeGetError = false
      state.isMeGetSuccess = false
      state.isMeGetLoading = false
      state.meGetErrorMessage = ''
    },
    resetMeGetUser: (state) => {
      state.isMeGetError = false
      state.isMeGetSuccess = false
      state.isMeGetLoading = false
      state.meGetErrorMessage = ''
    },
    resetOtherUser: (state) => {
      state.otherUser = null
      state.isOtherGetError = false
      state.isOtherGetSuccess = false
      state.isOtherGetLoading = false
      state.otherGetErrorMessage = ''
    },
    resetMeUpdateUser: (state) => {
      state.isMeUpdateError = false
      state.isMeUpdateSuccess = false
      state.isMeUpdateLoading = false
      state.meUpdateErrorMessage = ''
    },
    resetBlockUser: (state) => {
      state.isBlockUserError = false
      state.isBlockUserSuccess = false
      state.isBlockUserLoading = false
      state.blockUserErrorMessage = ''
    },
    resetRateUser: (state) => {
      state.isRateUserError = false
      state.isRateUserSuccess = false
      state.isRateUserLoading = false
      state.rateUserErrorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeUser.pending, (state) => {
        state.isMeGetLoading = true
        state.isMeGetError = false
        state.isMeGetSuccess = false
        state.meGetErrorMessage = ''
      })
      .addCase(getMeUser.fulfilled, (state, action) => {
        state.isMeGetLoading = false
        state.isMeGetSuccess = true
        state.isMeGetError = false
        state.meGetErrorMessage = ''
        state.meUser = action.payload
      })
      .addCase(getMeUser.rejected, (state, action) => {
        state.isMeGetLoading = false
        state.isMeGetError = true
        state.meGetErrorMessage = action.payload
      })
      .addCase(getOtherUser.pending, (state) => {
        state.isOtherGetLoading = true
        state.isOtherGetError = false
        state.isOtherGetSuccess = false
        state.otherGetErrorMessage = ''
      })
      .addCase(getOtherUser.fulfilled, (state, action) => {
        state.isOtherGetLoading = false
        state.isOtherGetSuccess = true
        state.isOtherGetError = false
        state.otherGetErrorMessage = ''
        state.otherUser = action.payload
      })
      .addCase(getOtherUser.rejected, (state, action) => {
        state.isOtherGetLoading = false
        state.isOtherGetError = true
        state.otherGetErrorMessage = action.payload
      })
      .addCase(updateMeUser.pending, (state) => {
        state.isMeUpdateLoading = true
        state.isMeUpdateError = false
        state.isMeUpdateSuccess = false
        state.meUpdateErrorMessage = ''
      })
      .addCase(updateMeUser.fulfilled, (state, action) => {
        state.isMeUpdateLoading = false
        state.isMeUpdateSuccess = true
        state.isMeUpdateError = false
        state.meUpdateErrorMessage = ''
        state.meUser = action.payload
      })
      .addCase(updateMeUser.rejected, (state, action) => {
        state.isMeUpdateLoading = false
        state.isMeUpdateError = true
        state.meUpdateErrorMessage = action.payload
      })
      .addCase(blockUser.pending, (state) => {
        state.isBlockUserLoading = true
        state.isBlockUserError = false
        state.isBlockUserSuccess = false
        state.blockUserErrorMessage = ''
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.isBlockUserLoading = false
        state.isBlockUserSuccess = true
        state.isBlockUserError = false
        state.blockUserErrorMessage = ''
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.isBlockUserLoading = false
        state.isBlockUserError = true
        state.blockUserErrorMessage = action.payload
      })
      .addCase(rateUser.pending, (state) => {
        state.isRateUserLoading = true
        state.isRateUserError = false
        state.isRateUserSuccess = false
        state.rateUserErrorMessage = ''
      })
      .addCase(rateUser.fulfilled, (state, action) => {
        state.isRateUserLoading = false
        state.isRateUserSuccess = true
        state.isRateUserError = false
        state.rateUserErrorMessage = ''
      })
      .addCase(rateUser.rejected, (state, action) => {
        state.isRateUserLoading = false
        state.isRateUserSuccess = false
        state.isRateUserError = true
        state.rateUserErrorMessage = action.payload
      })
  },
})

export const {
  resetMeUser,
  resetMeGetUser,
  resetOtherUser,
  resetMeUpdateUser,
  resetBlockUser,
  resetRateUser,
} = userSlice.actions

export default userSlice.reducer
