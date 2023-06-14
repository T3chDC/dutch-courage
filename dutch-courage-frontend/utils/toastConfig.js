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
      style={{ borderLeftColor: 'green', zIndex: 9999 }}
      contentContainerStyle={{
        backgroundColor: 'green',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14, color: 'white' }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12, color: 'white' }}
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
      contentContainerStyle={{
        backgroundColor: 'red',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }}
      text1NumberOfLines={5}
      text1Style={{ fontSize: 14, color: 'white' }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12, color: 'white' }}
    />
  ),

  /*
    Overwrite 'info' type,
    by modifying the existing `InfoToast` component
    */
  info: (props) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: '#ffbb33', zIndex: 9999 }}
      contentContainerStyle={{
        backgroundColor: '#ffbb33',
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
      }}
      text1NumberOfLines={3}
      text1Style={{ fontSize: 14, color: 'white' }}
      text2NumberOfLines={3}
      text2Style={{ fontSize: 12, color: 'white' }}
    />
  ),
}

// Export the config
export default ToastConfig
