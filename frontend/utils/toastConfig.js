// this file configures toast styles
// import default toast classes to be extended
import Toast, {
  BaseToast,
  SuccessToast,
  InfoToast,
  ErrorToast,
} from 'react-native-toast-message'

// Create the config
const ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `SuccessToast` component
  */
  success: (props) => (
    <SuccessToast {...props} style={{ borderLeftColor: 'green' }} />
  ),

  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast {...props} style={{ borderLeftColor: 'red' }} />
  ),

  /*
    Overwrite 'info' type,
    by modifying the existing `InfoToast` component
    */
  info: (props) => <InfoToast {...props} style={{ borderLeftColor: 'blue' }} />,
}

// Export the config
export default ToastConfig
