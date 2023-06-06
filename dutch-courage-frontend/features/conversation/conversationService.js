// This file is responsible for making the API calls to the backend for handling conversation data
import axios from 'axios'
import { BACKEND_URL } from '../../config'

const API_URL = BACKEND_URL + '/api/v1/conversations'

//get all conversations for logged in user
const getAllConversationsOfUser = async (token) => {
  const response = await axios.get(API_URL + '/getMyConversations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//create a new conversation
const createConversation = async (token, data) => {
  const response = await axios.post(API_URL + '/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//get a conversation by id
const getConversationById = async (token, id) => {
  const response = await axios.get(API_URL + `/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//update a conversation by id
const updateConversationById = async (token, id, data) => {
  const response = await axios.put(API_URL + `/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

//delete a conversation by id
const deleteConversationById = async (token, id) => {
  const response = await axios.delete(API_URL + `/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

const conversationService = {
  getAllConversationsOfUser,
  createConversation,
  getConversationById,
  updateConversationById,
  deleteConversationById,
}

export default conversationService
