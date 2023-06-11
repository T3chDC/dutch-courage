// This file is used to create a socket connection to the backend server
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config'

const socket = io(SOCKET_URL)

export default socket