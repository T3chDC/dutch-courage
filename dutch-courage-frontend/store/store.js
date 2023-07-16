import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import conversationReducer from '../features/conversation/conversationSlice'
import messageReducer from '../features/message/messageSlice'
import locationReducer from '../features/location/locationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer,
    location: locationReducer,
  },
})
