import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native'
import { UserIcon, ChatBubbleLeftRightIcon } from 'react-native-heroicons/solid'
import { HandRaisedIcon } from 'react-native-heroicons/outline'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { getOtherUser, resetOtherUser } from '../features/user/userSlice'
import {
  createConversation,
  resetCreateConversation,
  resetConversation,
} from '../features/conversation/conversationSlice'
import {
  createMessage,
  resetCreateMessage,
  resetMessage,
} from '../features/message/messageSlice'
import ToggleSwitch from '../components/ToggleSwitch'
import TouchableRatingStars from '../components/TouchableRatingStars'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'
import { logout } from '../features/auth/authSlice'
import { BACKEND_URL } from '../config'
import LowerRatingModal from '../components/LowerRatingModal'
import BottomDrawer from '../components/BottomDrawer'
import { rateUser, resetRateUser } from '../features/user/userSlice'
import socket from '../utils/socketInit'

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  and,
} from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

const OtherUserProfileScreen = ({ route }) => {
  // Navigation hook
  const navigation = useNavigation()
  // Redux Dispatch hook
  const dispatch = useDispatch()

  // Route params
  const { userId, locationDescription } = route.params

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth)
  const {
    otherUser,
    isOtherGetLoading,
    isOtherGetSuccess,
    isOtherGetError,
    otherGetErrorMessage,

    isRateUserLoading,
    isRateUserSuccess,
    isRateUserError,
    rateUserErrorMessage,
  } = useSelector((state) => state.user)

  const {
    conversation,
    isCreateConversationLoading,
    isCreateConversationSuccess,
    isCreateConversationError,
    createConversationErrorMessage,
  } = useSelector((state) => state.conversation)

  const {
    message,
    isCreateMessageLoading,
    isCreateMessageSuccess,
    isCreateMessageError,
    createMessageErrorMessage,
  } = useSelector((state) => state.message)

  // Local State variables
  const [rating, setRating] = useState(5)
  const [imageUrl, setImageUrl] = useState('')
  const [galleryImage1Url, setGalleryImage1Url] = useState('')
  const [galleryImage2Url, setGalleryImage2Url] = useState('')
  const [galleryImage3Url, setGalleryImage3Url] = useState('')
  const [userName, setUserName] = useState('')
  const [mantra, setMantra] = useState('')
  const [ageRange, setAgeRange] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [topInterests, setTopInterests] = useState([])
  const [isSwitchOn, setIsSwitchOn] = useState(false)

  // Staste for rating of other users
  const [otherUserRatingValue, setOtherUserRatingValue] = useState(0)

  // const [report, setReport] = useState("");
  // const [reportCount, setReportCount] = useState(0);

  const [showLowerRatingModal, setShowLowerRatingModal] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate('Login')
    }
  }, [userInfo, navigation])

  // Get user info
  useEffect(() => {
    if (isOtherGetError) {
      Toast.show({
        type: 'error',
        text1: otherGetErrorMessage,
        visibilityTime: 3000,
      })
    } else if (isOtherGetSuccess) {
      setRating(otherUser.rating)
      setImageUrl(otherUser.imageUrl)
      setGalleryImage1Url(otherUser.galleryImage1Url)
      setGalleryImage2Url(otherUser.galleryImage2Url)
      setGalleryImage3Url(otherUser.galleryImage3Url)
      setUserName(otherUser.userName)
      setMantra(otherUser.mantra)
      setAgeRange(otherUser.ageRange)
      setGender(otherUser.gender)
      setLocation(otherUser.location)
      setTopInterests(otherUser.topInterests)
    } else {
      dispatch(getOtherUser(userId))
    }
  }, [dispatch, isOtherGetError, isOtherGetSuccess, otherGetErrorMessage])

  // Reset user profile get status on unmount
  useEffect(() => {
    return () => {
      dispatch(resetOtherUser())
      dispatch(resetCreateConversation())
      dispatch(resetConversation())
      dispatch(resetCreateMessage())
      dispatch(resetMessage())
    }
  }, [dispatch])

  // function to handle to go back
  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => backHandler.remove()
  }, [navigation])

  // Function to create a conversation with a message in firestore
  const createConversationAndMessage = async () => {
    try {
      // Check if there is an existing conversation in firestore
      const existingConversationRef = await getDocs(
        query(
          collection(firestore, 'conversations'),
          where('participants', 'array-contains-any', [userInfo._id, userId])
        )
      )

      console.log('existingConversationRef', existingConversationRef.docs)

      if (
        existingConversationRef !== null &&
        existingConversationRef.docs?.length > 0 &&
        existingConversationRef.docs[0]?.acceptedBy.length === 2
      ) {
        Toast.show({
          type: 'error',
          text1: 'Conversation already exists',
          visibilityTime: 3000,
        })
        return
      } else if (
        existingConversationRef !== null &&
        existingConversationRef.docs?.length > 0 &&
        existingConversationRef.docs[0]?.acceptedBy.length === 1
      ) {
        Toast.show({
          type: 'error',
          text1: 'The other user has not responded to your request yet',
          visibilityTime: 3000,
        })
        return
      } else {
        const conversationRef = await addDoc(
          collection(firestore, 'conversations'),
          {
            participants: [userInfo._id, userId],
            acceptedBy: [userInfo._id],
            createdAt: serverTimestamp(),
          }
        )

        await addDoc(collection(firestore, 'messages'), {
          conversationId: conversationRef.id,
          sender: userInfo._id,
          messageType: 'text',
          message: `You have a notification from ${userInfo.userName}`,
          createdAt: serverTimestamp(),
        })

        // Update the conversation last message
        await updateDoc(doc(firestore, 'conversations', conversationRef.id), {
          lastMessage: {
            sender: userInfo._id,
            messageType: 'text',
            message: `You have a notification from ${userInfo.userName}`,
            createdAt: serverTimestamp(),
          },
        })

        Toast.show({
          type: 'success',
          text1: `Your wave was sent to ${userName}`,
          visibilityTime: 3000,
        })
      }
    } catch (error) {
      console.error('Error adding document: ', error)
      Toast.show({
        type: 'error',
        text1: 'Error creating conversation',
        visibilityTime: 3000,
      })
    }
  }

  // function to create a conversation on swipe
  const handleSwipe = () => {
    createConversationAndMessage()
  }

  // if the conversation is created successfully, create a message
  // useEffect(() => {
  //   if (isCreateConversationError) {
  //     Toast.show({
  //       type: 'error',
  //       text1: createConversationErrorMessage,
  //       visibilityTime: 3000,
  //     })
  //   } else if (isCreateConversationSuccess) {
  //     dispatch(
  //       createMessage({
  //         conversationId: conversation._id,
  //         sender: userInfo._id,
  //         messageType: 'text',
  //         message: `You have a notification from ${userInfo.userName}`,
  //       })
  //     )
  //   }
  // }, [
  //   dispatch,
  //   isCreateConversationError,
  //   isCreateConversationSuccess,
  //   createConversationErrorMessage,
  //   // conversation,
  //   userInfo,
  // ])

  // if the message is created successfully, toast a success message
  // useEffect(() => {
  //   if (isCreateMessageError) {
  //     Toast.show({
  //       type: 'error',
  //       text1: createMessageErrorMessage,
  //       visibilityTime: 3000,
  //     })
  //   } else if (isCreateMessageSuccess) {
  //     socket.emit('sendMessage', {
  //       conversationId: conversation._id,
  //       senderId: userInfo._id,
  //       receiverId: userId,
  //       messageType: message.messageType,
  //       message: message.message,
  //       messageImageUrl: message.messageImageUrl,
  //       createdAt: message.createdAt,
  //     })
  //     Toast.show({
  //       type: 'success',
  //       text1: `Your wave was sent to ${userName}`,
  //       visibilityTime: 3000,
  //     })
  //   }
  // }, [
  //   dispatch,
  //   isCreateMessageError,
  //   isCreateMessageSuccess,
  //   createMessageErrorMessage,
  // ])

  // show toast message if star rating is successful or show error message if star rating fails
  useEffect(() => {
    if (isRateUserSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Your rating was submitted successfully',
        visibilityTime: 3000,
        autoHide: true,
      })
      dispatch(resetRateUser())
    } else if (isRateUserError) {
      Toast.show({
        type: 'error',
        text1: rateUserErrorMessage,
        visibilityTime: 3000,
        autoHide: true,
      })
      dispatch(resetRateUser())
    }
  }, [isRateUserSuccess, isRateUserError])

  // function to handle rate user
  const rateOtherUser = (userRated) => {
    if (userRated < 3) {
      setShowLowerRatingModal(true)
    } else {
      dispatch(
        rateUser({
          userId,
          rating: userRated,
        })
      )
      // console.log('User rated ' + userRated)
    }
  }

  return (
    <View className='bg-black flex-1 justify-start items-center relative'>
      {/* background cutoff image*/}
      <Image
        source={require('../assets/projectImages/profileBackgroundCutOff.png')}
        className='w-[100vw] h-[40vh]'
      />

      <TouchableOpacity
        className='absolute top-10 left-4 flex-row items-center'
        onPress={() => {
          navigation.goBack()
        }}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className='text-white text-base top-[-1]'>{'< Back'}</Text>
      </TouchableOpacity>

      {isOtherGetLoading ? (
        <Progress.CircleSnail
          color={['#22A6B3', '#22A6B3', '#22A6B3']}
          size={100}
          thickness={5}
          className='mt-[-240] w-[100vw] flex-row justify-center items-center'
        />
      ) : (
        <>
          {/* rating stars based on rating values */}
          <View className='mt-[-240] w-[100vw] flex-row justify-center items-center'>
            <TouchableRatingStars
              rating={rating}
              rateUser={rateOtherUser}
              setOtherUserRatingValue={setOtherUserRatingValue}
            />
          </View>

          {/* profile image */}
          {imageUrl ? (
            <View className='mt-4 w-68 h-68 rounded-full bg-[#FCFCFE] flex-row justify-center items-center border-2 border-white'>
              <Image
                source={{
                  uri: `${BACKEND_URL}/uploads/${imageUrl.slice(
                    imageUrl.lastIndexOf('/') + 1
                  )}`,
                }}
                className='w-64 h-64 rounded-full'
                resizeMode='cover'
              />
            </View>
          ) : (
            <View className='mt-4 w-68 h-68 rounded-full bg-[#FCFCFE] flex-row justify-center items-center border-2 border-white'>
              <UserIcon
                name='user'
                size={64}
                color='gray'
                className='w-64 h-64 rounded-full'
              />
            </View>
          )}

          {/* Images */}
          {(galleryImage1Url || galleryImage2Url || galleryImage3Url) && (
            <View className='mt-4 w-[100vw] flex-row justify-center items-center'>
              {galleryImage1Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage1Url.slice(
                        galleryImage1Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}

              {galleryImage2Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage2Url.slice(
                        galleryImage2Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}

              {galleryImage3Url !== '' && (
                <View className='w-11 h-11 rounded-full mx-5 bg-[#FCFCFE] flex-row justify-center items-center'>
                  <Image
                    source={{
                      uri: `${BACKEND_URL}/uploads/${galleryImage3Url.slice(
                        galleryImage3Url.lastIndexOf('/') + 1
                      )}`,
                    }}
                    className='w-10 h-10 rounded-full'
                    resizeMode='cover'
                  />
                </View>
              )}
            </View>
          )}

          {/* User Name */}
          <View className='mt-4 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-3xl font-medium'>{userName}</Text>
          </View>

          {/* Mantra */}
          <View className='mt-1 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-xl font-medium'>{mantra}</Text>
          </View>

          {/* Age Range, gender and location */}
          <View className='mt-1 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-base font-normal'>
              {ageRange} {gender}, {location}
            </Text>
          </View>

          {/* Top Interests */}
          <View className='mt-1 mb-2 w-[100vw] flex-row justify-center items-center'>
            <Text className='text-white text-base font-normal'>
              {topInterests.map((interest, idx) => (
                <Text key={idx} className='text-white text-base font-normal'>
                  {' '}
                  {idx < 2 ? `${interest}, ` : idx === 2 ? `${interest}` : ''}
                </Text>
              ))}
            </Text>
          </View>

          {/* Swipable Button */}
          <View className='mt-5 w-[100vw] flex-row justify-center items-center'>
            <ToggleSwitch
              text={{
                on: locationDescription
                  ? `@${locationDescription}`
                  : 'User is not live',
                off: locationDescription
                  ? `@${locationDescription}`
                  : 'User is not live',
                activeTextColor: 'white',
                inactiveTextColor: '#655A5A',
              }}
              textStyle={{
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: isSwitchOn ? 0 : -50,
                marginRight: isSwitchOn ? -50 : 0,
              }}
              color={{
                indicator: isSwitchOn ? '#FFFFFF' : '#655A5A',
                active: '#22A6B3',
                inactive: '#D9D9D9',
                activeBorder: '#41B4A4',
                inactiveBorder: '#E9E9E9',
              }}
              active={isSwitchOn}
              disabled={false}
              width={200}
              radius={25}
              willBehaveLikeSwitch={false}
              // onValueChange={() => {
              //   if (isSwitchOn) {
              //     setIsSwitchOn(!isSwitchOn)
              //     return
              //   }
              //   handleSwipe()
              //   setIsSwitchOn(!isSwitchOn)
              // }}
              onToggle={(isOn) => {
                if (isOn) {
                  setIsSwitchOn(true)
                  handleSwipe()
                } else {
                  setIsSwitchOn(false)
                }
              }}
            />
            {/* <SwipeButton
              title={`@${location}`}
              swipeSuccessThreshold={70}
              height={45}
              width={300}
              onSwipeSuccess={() => handleSwipe()}
              thumbIconBackgroundColor='#655A5A'
              thumbIconBorderColor='#655A5A'
              railBackgroundColor='#D9D9D9'
              railBorderColor='#D9D9D9'
              railFillBackgroundColor='rgba(34, 166, 179, 0.5)'
              railFillBorderColor='#22A6B3'
            /> */}
          </View>
          <View className='flex-row justify-center items-center mt-2'>
            <Text className='text-white text-xl'>Slide to wave </Text>
            <HandRaisedIcon className='mt-5' color={'yellow'} />
          </View>

          {/* Modal Showing Button */}
          {/* <View className='flex-row justify-center items-center mt-2'>
            <TouchableOpacity onPress={() => setShowLowerRatingModal(true)}>
              <View className='w-32 h-8 rounded-full bg-[#22A6B3] flex-row justify-center items-center'>
                <Text className='text-white text-lg font-bold'>Modal</Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Lower Rating Modal */}
          <LowerRatingModal
            modalVisible={showLowerRatingModal}
            setModalVisible={setShowLowerRatingModal}
            // report={report}
            // setReport={setReport}
            // reportCount={reportCount}
            // setReportCount={setReportCount}
            rating={otherUserRatingValue}
            setRating={setRating}
            userId={userId}
          />

          {/* Chat and User Profile Icons */}
          <BottomDrawer />
        </>
      )}
    </View>
  )
}

export default OtherUserProfileScreen
