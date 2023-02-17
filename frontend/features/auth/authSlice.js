// This file is responsible for handling the state of the authentication process
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import authService from './authService'

//Fetch user from async storage
const getUserFromAsyncStorage = async () => {
  try {
    const user = await SecureStore.getItemAsync('DCUserInfo')
    return user != null ? JSON.parse(user) : null
  } catch (err) {
    console.log(err)
  }
}

//Remove user from async storage
const removeUserFromAsyncStorage = async () => {
  try {
    await SecureStore.deleteItemAsync('DCUserInfo')
  } catch (err) {
    console.log(err)
  }
}

//get user from asyncstorage
const userInfoRetrieved = getUserFromAsyncStorage()

//initial state
const initialState = {
  userInfo: userInfoRetrieved,
  isSignUpError: false,
  isSignUpLoading: false,
  isSignUpSuccess: false,
  signUpErrorMessage: '',
  signUpRequestStatus: '', // for debugging purposes only
  isSignInError: false,
  isSignInLoading: false,
  isSignInSuccess: false,
  signInErrorMessage: '',
  signInRequestStatus: '', // for debugging purposes only
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
        state.isSignUpSuccess = false
        state.isSignUpError = false
        state.signUpErrorMessage = ''
        state.signUpRequestStatus = 'pending'
      })
      .addCase(signupLocal.fulfilled, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpSuccess = true
        state.isSignUpError = false
        state.signUpErrorMessage = ''
        state.userInfo = action.payload
        state.signUpRequestStatus = 'fulfilled'
      })
      .addCase(signupLocal.rejected, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpError = true
        state.isSignUpSuccess = false
        state.signUpErrorMessage = action.payload
        state.signUpRequestStatus = 'rejected'
      })
      .addCase(signinLocal.pending, (state) => {
        state.isSignInLoading = true
        state.isSignInSuccess = false
        state.isSignInError = false
        state.signInErrorMessage = ''
        state.signInRequestStatus = 'pending'
      })
      .addCase(signinLocal.fulfilled, (state, action) => {
        state.isSignInLoading = false
        state.isSignInSuccess = true
        state.isSignInError = false
        state.signInErrorMessage = ''
        state.userInfo = action.payload
        state.signInRequestStatus = 'fulfilled'
      })
      .addCase(signinLocal.rejected, (state, action) => {
        state.isSignInLoading = false
        state.isSignInError = true
        state.isSignInSuccess = false
        state.signInErrorMessage = action.payload
        state.signInRequestStatus = 'rejected'
      })
  },
})

export const { resetSignIn, resetSignUp, logout } = authSlice.actions

export default authSlice.reducer
