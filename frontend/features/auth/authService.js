// This file is responsible for making the API calls to the backend
import axios from 'axios'
import asyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '@env'

const API_URL = BACKEND_URL + '/api/v1/users'

//signup user locally
const signupLocal = async (userData) => {
  const response = await axios.post(API_URL + '/signup/local', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await asyncStorage.setItem('DCUserInfo', JSON.stringify(response.data.data))
  }
  return response.data.data
}

//signin user locally
const signinLocal = async (userData) => {
  const response = await axios.post(API_URL + '/signin/local', userData)
  if (response.data.status === 'success') {
    //store in async storage of device
    await asyncStorage.setItem('DCUserInfo', JSON.stringify(response.data.data))
  }
  return response.data.data
}

const authService = {
  signupLocal,
  signinLocal,
}

export default authService
