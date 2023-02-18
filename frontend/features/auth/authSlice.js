// This file is responsible for handling the state of the authentication process
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as SecureStore from 'expo-secure-store'
import authService from './authService'

// //get user from secure storage
// const getUserFromSecureStorage = async () => {
//   try {
//     const userInfo = await SecureStore.getItemAsync('DCUserInfo')
//     if (userInfo) {
//       return JSON.parse(userInfo)
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

//Remove user from secure storage
// const removeUserFromAsyncStorage = async () => {
//   try {
//     await SecureStore.deleteItemAsync('DCUserInfo')
//   } catch (err) {
//     console.log(err)
//   }
// }

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

//initial state
const initialState = {
  userInfo: null,
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: (state) => {
    //   state.userInfo = null
    //   removeUserFromAsyncStorage()
    // },
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
