import axios from 'axios'
import { BACKEND_URL } from '../../config'

const API_URL = BACKEND_URL + '/api/v1/location'

// Add user and get nearby users
const addUser = async (userId, location) => {
  const response = await axios.post(API_URL + '/addUser', {
    userId,
    location,
  })
  return response.data.data
}

// Remove user
const removeUser = async (userId) => {
  const response = await axios.post(API_URL + '/removeUser', {
    userId,
  })
  return response.data.data
}

const locationService = {
    addUser,
    removeUser,
}

export default locationService