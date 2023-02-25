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

//Forgot password request
const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(API_URL + '/forgotPassword', userData)
    return response.data
  } catch (err) {
    return err.response.data
  }
}

const authService = {
  signupLocal,
  signinLocal,
  forgotPassword,
}

export default authService
