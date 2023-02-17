import { store } from './store/store'
import { Provider } from 'react-redux'
import NavigationHandler from './navigation/NavigationHandler'

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationHandler />
      </Provider>
    </>
  )
}
