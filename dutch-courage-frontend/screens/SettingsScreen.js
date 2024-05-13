import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ToggleSwitch from "../components/ToggleSwitch";
import * as Progress from "react-native-progress";
import { logout } from "../features/auth/authSlice";
import { resetMeUser } from "../features/user/userSlice";
import { getAllConversationsOfUser } from "../features/conversation/conversationSlice";
import { ExclamationTriangleIcon } from "react-native-heroicons/solid";

const SettingsScreen = () => {
  // Navigation Hook
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Redux State variables
  const { userInfo } = useSelector((state) => state.auth);

  // UseEffect to check if the user is login or not
  useEffect(() => {
    if (!userInfo) {
      navigation.navigate("Login");
    }
  }, [userInfo, navigation]);

  // UseEffect when user tries to go back to profile screen
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("UserProfile");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetMeUser());
    navigation.navigate("Login");
  };

  return (
    <View className="bg-black flex-1 justify-start items-center relative">
      <TouchableOpacity
        className="absolute top-10 left-4 flex-row items-center"
        onPress={() => {
          navigation.navigate("UserProfile");
        }}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className="text-white text-base top-[-1]">{"< Back"}</Text>
      </TouchableOpacity>

      <View className="top-9">
        <Text className="text-white font-medium text-2xl">
          Settings & Privacy
        </Text>
      </View>

      {/* Settings Contents */}
      <View className="flex-row items-center justify-evenly relative">
        <View className="flex-row items-center justify-evenly relative">
          {/* <View className="flex-row items-center justify-evenly relative"> */}
          <Text className="text-[#808080] text-base absolute top-[50] left-5">
            Account
          </Text>

          {/* <Text className='text-white relative top-20'>Logout</Text> */}
        </View>
      </View>
      {/* </View> */}

      <View className="flex-row items-center justify-between absolute top-[100] mt-2 left-5">
        <View className=" flex-row items-center">
          <ExclamationTriangleIcon size={20} color={"white"} />
        </View>
        <View className="flex-row items-center ">
          <TouchableOpacity onPress={() => handleLogout()}>
            <Text className="text-[#808080] text-white text-lg left-3">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View className="flex-row">
        <TouchableOpacity>
          <Text className="text-white"> Logout </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default SettingsScreen;
