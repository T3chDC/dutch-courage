import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
  meUser: null,
  isMeGetError: false,
  isMeGetSuccess: false,
  isMeGetLoading: false,
  meGetErrorMessage: '',
  isMeUpdateError: false,
  isMeUpdateSuccess: false,
  isMeUpdateLoading: false,
  meUpdateErrorMessage: '',
}

//get info about logged in user
export const getMeUser = createAsyncThunk(
  'user/getMeUser',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
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

//update info about logged in user
export const updateMeUser = createAsyncThunk(
  'user/updateMeUser',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token
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
    resetMeUpdateUser: (state) => {
      state.isMeUpdateError = false
      state.isMeUpdateSuccess = false
      state.isMeUpdateLoading = false
      state.meUpdateErrorMessage = ''
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
  },
})

export const { resetMeUser, resetMeUpdateUser } = userSlice.actions

export default userSlice.reducer
