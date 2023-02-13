// This file is responsible for handling the state of the authentication process
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import asyncStorage from '@react-native-async-storage/async-storage'
import authService from './authService'

//Fetch user from async storage
const getUserFromAsyncStorage = async () => {
  const user = await asyncStorage.getItem('userInfo')
  return JSON.parse(user)
}

//Remove user from async storage
const removeUserFromAsyncStorage = async () => {
  await asyncStorage.removeItem('userInfo')
}

//get user from asyncstorage
const userInfo = getUserFromAsyncStorage()

const initialState = {
  userInfo: userInfo ? userInfo : null,
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null
      removeUserFromAsyncStorage()
    },
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
        state.isSignInSuccess = false
        state.isSignInError = false
        state.signInErrorMessage = ''
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
  },
})

export const { resetSignIn, resetSignUp, logout } = authSlice.actions

export default authSlice.reducer
