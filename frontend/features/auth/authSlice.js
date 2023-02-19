// This file is responsible for handling the state of the authentication process
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import authService from './authService'

//initial state
const initialState = {
  userInfo: null,
  isSignUpError: false,
  isSignUpLoading: false,
  isSignUpSuccess: false,
  signUpErrorMessage: '',
  isSignInError: false,
  isSignInLoading: false,
  isSignInSuccess: false,
  signInErrorMessage: '',
}

//signup user locally
export const signupLocal = createAsyncThunk(
  'auth/signupLocal',
  async (userData, thunkAPI) => {
    try {
      return await authService.signupLocal(userData)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//signin user locally
export const signinLocal = createAsyncThunk(
  'auth/signinLocal',
  async (userData, thunkAPI) => {
    try {
      return await authService.signinLocal(userData)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// get user from secure storage
export const getInitialState = createAsyncThunk(
  'auth/getInitialState',
  async (_, thunkAPI) => {
    try {
      return await SecureStore.getItemAsync('DCUserInfo')
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//logout user asynchronously by removing user from storage
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await SecureStore.deleteItemAsync('DCUserInfo')
    return null
  } catch (err) {
    const message =
      (err.response && err.response.data && err.response.data.message) ||
      err.message ||
      err.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetSignUp: (state) => {
      state.isSignUpError = false
      state.isSignUpLoading = false
      state.isSignUpSuccess = false
      state.signUpErrorMessage = ''
    },

    resetSignIn: (state) => {
      state.isSignInError = false
      state.isSignInLoading = false
      state.isSignInSuccess = false
      state.signInErrorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupLocal.pending, (state) => {
        state.isSignUpLoading = true
        state.isSignUpSuccess = false
        state.isSignUpError = false
        state.signUpErrorMessage = ''
      })
      .addCase(signupLocal.fulfilled, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpSuccess = true
        state.isSignUpError = false
        state.signUpErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signupLocal.rejected, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpError = true
        state.isSignUpSuccess = false
        state.signUpErrorMessage = action.payload
      })
      .addCase(signinLocal.pending, (state) => {
        state.isSignInLoading = true
        state.isSignInSuccess = false
        state.isSignInError = false
        state.signInErrorMessage = ''
      })
      .addCase(signinLocal.fulfilled, (state, action) => {
        state.isSignInLoading = false
        state.isSignInSuccess = true
        state.isSignInError = false
        state.signInErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signinLocal.rejected, (state, action) => {
        state.isSignInLoading = false
        state.isSignInError = true
        state.isSignInSuccess = false
        state.signInErrorMessage = action.payload
      })
      .addCase(getInitialState.fulfilled, (state, action) => {
        state.userInfo = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null
      })
  },
})

export const { resetSignIn, resetSignUp } = authSlice.actions

export default authSlice.reducer
