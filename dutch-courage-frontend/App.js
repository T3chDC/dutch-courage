import { store } from './store/store'
import { Provider } from 'react-redux'
import NavigationHandler from './navigation/NavigationHandler'
import socket from './utils/socketInit'
import React, { useEffect } from 'react'

export default function App() {
  // Initialize socket connection
  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <Provider store={store}>
        <NavigationHandler />
      </Provider>
    </>
  )
}
