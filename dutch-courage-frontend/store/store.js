import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import conversationReducer from '../features/conversation/conversationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    conversation: conversationReducer,
  },
})
