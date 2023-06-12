// This file is used to create a socket connection to the backend server
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../config'
import { AppState } from 'react-native'

const socket = io(SOCKET_URL)

// Close socket connection when app is closed
AppState.addEventListener('change', (state) => {
    if (state === 'background') {
        socket.disconnect()
    }
    else {
        socket.connect()
    }
})



export default socket