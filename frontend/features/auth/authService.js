// This file is responsible for making the API calls to the backend for authentication
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { BACKEND_URL } from '../../config'

const API_URL = BACKEND_URL + '/api/v1/users'

//signup user locally
const signupLocal = async (userData) => {
  const response = await axios.post(API_URL + '/signup/local', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//post google authenticaiton token for signup and get saved userdata from backend
const signupGoogle = async (userData) => {
  const response = await axios.post(API_URL + '/signup/google', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//post facebook authenticaiton token for signup and get saved userdata from backend
const signupFacebook = async (userData) => {
  const response = await axios.post(API_URL + '/signup/facebook', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//signin user locally
const signinLocal = async (userData) => {
  const response = await axios.post(API_URL + '/signin/local', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//post google authenticaiton token for signin and get saved userdata from backend
const signinGoogle = async (userData) => {
  const response = await axios.post(API_URL + '/signin/google', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//post facebook authenticaiton token for signin and get saved userdata from backend
const signinFacebook = async (userData) => {
  const response = await axios.post(API_URL + '/signin/facebook', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await SecureStore.setItemAsync(
      'DCUserInfo',
      JSON.stringify(response.data.data)
    )
  }
  return response.data.data
}

//Forgot password request
const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(API_URL + '/forgotPassword', userData)
    return response.data
  } catch (err) {
    return err.response.data
  }
}

//Verify password reset OTP
const verifyPasswordResetOtp = async (userData) => {
  try {
    const response = await axios.post(
      API_URL + '/checkPasswordResetOTP',
      userData
    )
    return response.data
  } catch (err) {
    return err.response.data
  }
}

//Reset password
const resetPassword = async (userData) => {
  try {
    const response = await axios.post(API_URL + '/resetPassword', userData)
    return response.data
  } catch (err) {
    return err.response.data
  }
}

const authService = {
  signupLocal,
  signupGoogle,
  signupFacebook,
  signinLocal,
  signinGoogle,
  signinFacebook,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
}

export default authService
