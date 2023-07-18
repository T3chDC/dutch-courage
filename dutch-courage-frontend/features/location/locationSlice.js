// // This file is responsible for handling the state of the location data
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as Location from 'expo-location'
import locationService from './locationService'

const initialState = {
  ownLocation: null,
  isLocationLoading: false,
  isLocationSuccess: false,
  isLocationError: false,
  locationErrorMessage: '',

  isUserLive: false,

  nearbyUsers: [],
  isNearbyUsersLoading: false,
  isNearbyUsersSuccess: false,
  isNearbyUsersError: false,
  nearbyUsersErrorMessage: '',
}

// This function is responsible for getting the location of the user
export const getLocation = createAsyncThunk(
  'location/getLocation',
  async (_, thunkAPI) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return thunkAPI.rejectWithValue(
          'Permission to access location was denied'
        )
      }

      const location = await Location.getCurrentPositionAsync({})

      return location
    } catch (err) {
      const message = err.message || err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// This function is responsible for adding the user to the database
export const addUser = createAsyncThunk(
  'location/addUser',
  async (userId, thunkAPI) => {
    try {
      const detailedLocation = thunkAPI.getState().location.ownLocation
      if (!detailedLocation) {
        return thunkAPI.rejectWithValue('Location is not available')
      }
      const location = detailedLocation.coords
      const token = thunkAPI.getState().auth.token
      return await locationService.addUser(userId, location, token)
    } catch (err) {
      const message = err.message || err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// This function is responsible for removing the user from the database
export const removeUser = createAsyncThunk(
  'location/removeUser',
  async (userId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token
      return await locationService.removeUser(userId, token)
    } catch (err) {
      const message = err.message || err.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create location slice
const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    resetOwnLocation: (state) => {
      // state.ownLocation = null
      state.isLocationLoading = false
      state.isLocationSuccess = false
      state.isLocationError = false
      state.locationErrorMessage = ''
    },
    resetNearbyUsers: (state) => {
      // state.nearbyUsers = []
      state.isNearbyUsersLoading = false
      state.isNearbyUsersSuccess = false
      state.isNearbyUsersError = false
      state.nearbyUsersErrorMessage = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocation.pending, (state) => {
        state.isLocationLoading = true
        state.isLocationSuccess = false
        state.isLocationError = false
        state.locationErrorMessage = ''
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = true
        state.isLocationError = false
        state.ownLocation = action.payload
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = false
        state.isLocationError = true
        state.locationErrorMessage = action.payload
      })
      .addCase(addUser.pending, (state) => {
        state.isLocationLoading = true
        state.isLocationSuccess = false
        state.isLocationError = false
        state.locationErrorMessage = ''
        state.isUserLive = false
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = true
        state.isLocationError = false
        state.nearbyUsers =
          action.payload.nearbyUsers.length == 0
            ? []
            : action.payload.nearbyUsers
        state.isUserLive = true
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = false
        state.isLocationError = true
        state.locationErrorMessage = action.payload
        state.isUserLive = false
      })
      .addCase(removeUser.pending, (state) => {
        state.isLocationLoading = true
        state.isLocationSuccess = false
        state.isLocationError = false
        state.locationErrorMessage = ''
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = true
        state.isLocationError = false
        state.nearbyUsers = []
        state.isUserLive = false
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isLocationLoading = false
        state.isLocationSuccess = false
        state.isLocationError = true
        state.locationErrorMessage = action.payload
      })
  },
})

export const { resetOwnLocation, resetNearbyUsers } = locationSlice.actions

export default locationSlice.reducer
