// This file is responsible for making the API calls to the backend for handling message data
import axios from 'axios'
import { BACKEND_URL } from '../../config'

const API_URL = BACKEND_URL + '/api/v1/messages'

//create a new message
const createMessage = async (token, data) => {
  const response = await axios.post(API_URL + '/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//delete a message by id
const deleteMessageById = async (token, id) => {
  const response = await axios.delete(API_URL + `/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

const messageService = {
  createMessage,
  deleteMessageById,
}

export default messageService
