import { store } from './store/store'
import { Provider } from 'react-redux'
import NavigationHandler from './navigation/NavigationHandler'
import socket from './utils/socketInit'

export default function App() {
  // Initialize socket connection
  socket.connect()

  return (
    <>
      <Provider store={store}>
        <NavigationHandler />
      </Provider>
    </>
  )
}
