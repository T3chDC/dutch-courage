// import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
// import React, { useLayoutEffect, useEffect, useRef } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as Animatable from "react-native-animatable";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../features/auth/authSlice";
// // import Video from "react-native-video";
// import { Video } from "expo-av";
// import { Overlay } from "@rneui/base";

// const InitialLoaderScreen = () => {
//   const videoRef = useRef(null);

//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const { userInfo } = useSelector((state) => state.auth);
//   const { width, height } = useWindowDimensions(); // Loader Video Dimensions

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   }, [navigation]);

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       if (userInfo && userInfo.newUser) {
//         navigation.navigate("BlankProfile");
//       } else if (userInfo && userInfo.newUser === false) {
//         navigation.navigate("UserProfile");
//       } else {
//         navigation.navigate("Login");
//       }
//     }, 8000);
//   }, [userInfo, navigation]);

//   // Try autoplay the video on mount and log status for debugging
//   useEffect(() => {
//     let mounted = true;
//     const start = async () => {
//       try {
//         // If you want to trigger play programmatically:
//         if (videoRef.current && videoRef.current.playAsync) {
//           await videoRef.current.playAsync();
//         }
//       } catch (err) {
//         console.log("playAsync error:", err);
//       }
//     };
//     start();

//     return () => {
//       mounted = false;
//       // cleanup: unload to free memory
//       if (videoRef.current && videoRef.current.unloadAsync) {
//         videoRef.current.unloadAsync().catch(() => {});
//       }
//     };
//   }, []);

//   return (
//     <SafeAreaView className="bg-black flex-1 justify-center items-center">
//       {/* <Animatable.Image
//         source={require('../assets/projectImages/TempLogo1.png')}
//         animation='fadeIn'
//         iterationCount={1}
//         className='h-96 w-[100vw] rounded-lg'
//       /> */}
//       <Video
//         ref={videoRef}
//         source={require('../assets/projectImages/LoaderAnimation_v2.mp4')}
//         // source={{ uri: "../assets/projectImages/Loader Video.mp4" }}
//         // style={{ width: "100%", height: 400 }}
//         style={[styles.video, {width, height}]}
//         resizeMode="contain"
//         isLooping={false}
//         // isMuted={false}
//         shouldPlay={true}
//         repeat={true}
//         muted={false}
//         playInBackground={false}
//         playWhenInactive={false}
//         ignoreSilentSwitch={"ignore"}
//         useNativeControls={false}
//         // autoplay={false}
//         // onEnd={() => { navigation.navigate('Login') }}
//       />

//       {/* <Animatable.View
//         animation="slideInUp"
//         iterationCount={1}
//         className="flex-row justify-between w-80 mt-10"
//       > */}
//         {/* {!userInfo && (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('Login')}
//             className='bg-white rounded-md h-12 w-20 justify-center items-center'
//           >
//             <Text className='text-black'>Sign In</Text>
//           </TouchableOpacity>
//         )}

//         {!userInfo && (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('SignUp')}
//             className='bg-white rounded-md h-12 w-20 justify-center items-center'
//           >
//             <Text className='text-black'>Sign Up</Text>
//           </TouchableOpacity>
//         )} */}

//         {/* {userInfo && (
//           <TouchableOpacity
//             onPress={() => handleLogout()}
//             className='bg-white rounded-md h-12 w-20 justify-center items-center'
//           >
//             <Text className='text-black'>Log Out</Text>
//           </TouchableOpacity>
//         )} */}

//         {/* {userInfo && (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('BlankProfile')}
//             className='bg-white rounded-md h-12 w-20 justify-center items-center'
//           >
//             <Text className='text-black'>Blank Profile</Text>
//           </TouchableOpacity>
//         )}

//         {userInfo && (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('UserProfile')}
//             className='bg-white rounded-md h-12 w-20 justify-center items-center'
//           >
//             <Text className='text-black'>Filled Profile</Text>
//           </TouchableOpacity>
//         )} */}
//       {/* </Animatable.View> */}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   video: {
//     position: 'absolute',
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

// });

// export default InitialLoaderScreen;



import { StyleSheet } from "react-native";
import React, { useLayoutEffect, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Video } from "expo-av";

const InitialLoaderScreen = () => {
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userInfo && userInfo.newUser) {
        navigation.navigate("BlankProfile");
      } else if (userInfo && userInfo.newUser === false) {
        navigation.navigate("UserProfile");
      } else {
        navigation.navigate("Login");
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [userInfo, navigation]);

  useEffect(() => {
    const start = async () => {
      try {
        if (videoRef.current?.playAsync) {
          await videoRef.current.playAsync();
        }
      } catch (err) {
        console.log("playAsync error:", err);
      }
    };
    start();

    return () => {
      videoRef.current?.unloadAsync?.().catch(() => { });
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Video
        ref={videoRef}
        source={require("../assets/projectImages/LoaderVideo.mp4")}
        style={StyleSheet.absoluteFill} // 👈 stretches video to all edges
        resizeMode="cover"              // 👈 no black bars
        shouldPlay
        isLooping={false}
        muted={false}
        playInBackground={false}
        playWhenInactive={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default InitialLoaderScreen;
