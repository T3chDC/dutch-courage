import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { MagnifyingGlassIcon } from "react-native-heroicons/solid";
import { useDispatch, useSelector } from "react-redux";
import * as Progress from "react-native-progress";
import SwipeButton from "rn-swipe-button";
import Toast from "react-native-toast-message";
import {
  getMeUser,
  resetMeUser,
  resetMeGetUser,
} from "../features/user/userSlice";
import {
  getLocation,
  addUser,
  resetOwnLocation,
  resetNearbyUsers,
} from "../features/location/locationSlice";

import { BACKEND_URL } from "../config";
import MapView, { Marker } from "react-native-maps";

const LocationFinderScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const scrollViewRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const {
    ownLocation,
    isLocationLoading,
    isLocationSuccess,
    isLocationError,
    locationErrorMessage,
    isUserLive,
    nearbyUsers,
    isNearbyUsersLoading,
    isNearbyUsersSuccess,
    isNearbyUsersError,
    nearbyUsersErrorMessage,
  } = useSelector((state) => state.location);

  const {
    meUser,
    isMeGetLoading,
    isMeGetSuccess,
    isMeGetError,
    meGetErrorMessage,
  } = useSelector((state) => state.user);

  //Local state variables
  const [location, setLocation] = useState("");

  // Check if user is logged in
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate("Login");
    }
  }, [userInfo, navigation]);

  // function to handle to go back
  useEffect(() => {
    const backAction = () => {
      dispatch(getAllConversationsOfUser());
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  //Exit App on Back Press
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [userInfo, dispatch, navigation]);

  //Get User Info
  useEffect(() => {
    if (isMeGetError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: meGetErrorMessage,
        visibilityTime: 3000,
      });
    } else if (isMeGetSuccess) {
      setLocation(meUser.location);
    } else {
      dispatch(getMeUser());
    }
  }, [isMeGetError, isMeGetSuccess, meGetErrorMessage, dispatch]);

  // Scroll to bottom of the screen when keyboard is open
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () =>
      scrollViewRef.current.scrollToEnd({ animated: true })
    );

    // cleanup function
    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
    };
  }, []);

  return (
    <View className="bg-black flex-1 justify-start items-center relative">
      <TouchableOpacity
        className="absolute top-10 left-4"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text className="text-white text-base top-[-1]">{"< Back"}</Text>
      </TouchableOpacity>

      <View className="top-[8vh] justify-evenly items-center ">
        {/* <View className="flex flex-row">
          <MapView
            initialRegion={{
              latitude: 23.7941139,
              longitude: 90.4038988,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{
              width: 400,
              height: 450,
            }}
          >
            <Marker
              coordinate={{ latitude: 23.7941139, longitude: 90.4038988 }}
            ></Marker>
          </MapView>
        </View> */}

        <KeyboardAvoidingView
          behavior={"height"}
          className="flex-1 flex-col justify-end items-center w-100 h-[650] "
        >
          <ScrollView
            // className='flex flex-col justify-end items-center w-80'

            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View className="flex flex-row">
              <MapView
                initialRegion={{
                  latitude: 23.7941139,
                  longitude: 90.4038988,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                style={{
                  width: 400,
                  height: 450,
                }}
              >
                <Marker
                  coordinate={{ latitude: 23.7941139, longitude: 90.4038988 }}
                ></Marker>
              </MapView>
            </View>

            
            <View className="mt-5">
              <Text className="text-white text-sm font-bold left-[10vw]">
                Search Your Location
              </Text>

              {/* Search Location Text Field */}
              <View className="left-[10vw]">
                <TextInput
                  placeholder="&nbsp; Find Me"
                  placeholderTextColor="#808080"
                  keyboardType="default"
                  className="text-white text-base w-[320] h-10 flex-row mt-5 border-2 rounded-xl border-[#22A6B3] text-sm px-10"
                />
                <TouchableOpacity className="bottom-8 left-2 w-[20]">
                  <MagnifyingGlassIcon color="#22A6B3" />
                </TouchableOpacity>
              </View>

              {/* Locations */}
              <View className="">
                <View className="left-[15vw]">
                  <Text className="text-white text-base font-bold">
                    Jax Bar
                  </Text>
                  <Text className="text-white text-sm">
                    5-7 Brunswick Rd, Gloucester
                  </Text>
                </View>
                <View className="flex flex-row left-12 mt-[15] h-[1] w-[400] bg-[#22A6B3]"></View>

                <View className="left-[15vw] mt-5">
                  <Text className="text-white text-base font-bold">
                    Jax Bar
                  </Text>
                  <Text className="text-white text-sm">
                    5-7 Brunswick Rd, Gloucester
                  </Text>
                </View>
                <View className="flex flex-row left-12 mt-[15] h-[1] w-[400] bg-[#22A6B3]"></View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default LocationFinderScreen;
