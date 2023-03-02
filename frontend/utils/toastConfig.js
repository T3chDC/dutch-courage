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
    <SuccessToast
      {...props}
      style={{ borderLeftColor: 'green',  zIndex: 9999 }}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14 }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12 }}
    />
  ),

  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red', zIndex: 9999 }}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14 }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12, color: 'red' }}
    />
  ),

  /*
    Overwrite 'info' type,
    by modifying the existing `InfoToast` component
    */
  info: (props) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: 'blue', zIndex: 9999 }}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14 }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12 }}
    />
  ),
}

// Export the config
export default ToastConfig
