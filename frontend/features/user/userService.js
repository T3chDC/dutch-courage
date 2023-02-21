// This file is responsible for making the API calls to the backend for handling user data
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { BACKEND_URL } from '../../config'

const API_URL = BACKEND_URL + '/api/v1/users'

//get info about logged in user
const getMeUser = async (token) => {
  const response = await axios.get(API_URL + '/getMe', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//update info about logged in user
const updateMeUser = async (token, data) => {
  const response = await axios.patch(API_URL + '/updateMe', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

const userService = {
  getMeUser,
  updateMeUser,
}

export default userService
