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

//signup user with google
export const signupGoogle = createAsyncThunk(
  'auth/signupGoogle',
  async (userData, thunkAPI) => {
    try {
      return await authService.signupGoogle(userData)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//signup user with facebook
export const signupFacebook = createAsyncThunk(
  'auth/signupFacebook',
  async (userData, thunkAPI) => {
    try {
      return await authService.signupFacebook(userData)
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

//signin user with google
export const signinGoogle = createAsyncThunk(
  'auth/signinGoogle',
  async (userData, thunkAPI) => {
    try {
      return await authService.signinGoogle(userData)
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

//signin user with facebook
export const signinFacebook = createAsyncThunk(
  'auth/signinFacebook',
  async (userData, thunkAPI) => {
    try {
      return await authService.signinFacebook(userData)
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
      return JSON.parse(await SecureStore.getItemAsync('DCUserInfo'))
    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// change new User
export const changeNewUser = createAsyncThunk(
  'auth/changeNewUser',
  async (_, thunkAPI) => {
    try {
      await SecureStore.setItemAsync(
        'DCUserInfo',
        JSON.stringify({ ...thunkAPI.getState().auth.userInfo, newUser: false })
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

// Add expo push token to userInfo
export const addExpoPushToken = createAsyncThunk(
  'auth/addExpoPushToken',
  async (expoPushToken, thunkAPI) => {
    console.log(expoPushToken)
    try {
      await SecureStore.setItemAsync(
        'DCUserInfo',
        JSON.stringify({ ...thunkAPI.getState().auth.userInfo, expoPushToken })
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
        state.userInfo = null
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
      .addCase(signupGoogle.pending, (state) => {
        state.isSignUpLoading = true
        state.isSignUpSuccess = false
        state.isSignUpError = false
        state.signUpErrorMessage = ''
      })
      .addCase(signupGoogle.fulfilled, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpSuccess = true
        state.isSignUpError = false
        state.signUpErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signupGoogle.rejected, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpError = true
        state.isSignUpSuccess = false
        state.signUpErrorMessage = action.payload
      })
      .addCase(signupFacebook.pending, (state) => {
        state.isSignUpLoading = true
        state.isSignUpSuccess = false
        state.isSignUpError = false
        state.signUpErrorMessage = ''
      })
      .addCase(signupFacebook.fulfilled, (state, action) => {
        state.isSignUpLoading = false
        state.isSignUpSuccess = true
        state.isSignUpError = false
        state.signUpErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signupFacebook.rejected, (state, action) => {
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
      .addCase(signinGoogle.pending, (state) => {
        state.isSignInLoading = true
        state.isSignInSuccess = false
        state.isSignInError = false
        state.signInErrorMessage = ''
      })
      .addCase(signinGoogle.fulfilled, (state, action) => {
        state.isSignInLoading = false
        state.isSignInSuccess = true
        state.isSignInError = false
        state.signInErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signinGoogle.rejected, (state, action) => {
        state.isSignInLoading = false
        state.isSignInError = true
        state.isSignInSuccess = false
        state.signInErrorMessage = action.payload
      })
      .addCase(signinFacebook.pending, (state) => {
        state.isSignInLoading = true
        state.isSignInSuccess = false
        state.isSignInError = false
        state.signInErrorMessage = ''
      })
      .addCase(signinFacebook.fulfilled, (state, action) => {
        state.isSignInLoading = false
        state.isSignInSuccess = true
        state.isSignInError = false
        state.signInErrorMessage = ''
        state.userInfo = action.payload
      })
      .addCase(signinFacebook.rejected, (state, action) => {
        state.isSignInLoading = false
        state.isSignInError = true
        state.isSignInSuccess = false
        state.signInErrorMessage = action.payload
      })
      .addCase(getInitialState.fulfilled, (state, action) => {
        state.userInfo = action.payload
        state.isSignInError = false
        state.isSignInLoading = false
        state.isSignInSuccess = false
        state.signInErrorMessage = ''
        state.isSignUpError = false
        state.isSignUpLoading = false
        state.isSignUpSuccess = false
        state.signUpErrorMessage = ''
      })
      .addCase(changeNewUser.fulfilled, (state, action) => {
        state.userInfo = {
          ...state.userInfo,
          newUser: false,
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null
        state.isSignInError = false
        state.isSignInLoading = false
        state.isSignInSuccess = false
        state.signInErrorMessage = ''
        state.isSignUpError = false
        state.isSignUpLoading = false
        state.isSignUpSuccess = false
        state.signUpErrorMessage = ''
      })
  },
})

export const { resetSignIn, resetSignUp } = authSlice.actions

export default authSlice.reducer
