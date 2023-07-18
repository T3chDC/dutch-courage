import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as Progress from "react-native-progress";

const UsersNearbyScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

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

  return (
    <View className="bg-black flex-1 justify-start items-center relative">
      <TouchableOpacity
        className="absolute top-10 left-4"
        onPress={() => {
          navigation.goBack();
        }}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className="text-white text-base top-[-1]">{"< Back"}</Text>
      </TouchableOpacity>

      <View className="top-[50] flex-col justify-evenly items-center ">
        <Image
          source={require("../assets/projectImages/TempLogo1.png")}
          className=""
        />

        <Text className="text-white text-xl font-bold right-[120]">Around You</Text>
      </View>
    </View>
  );
};

export default UsersNearbyScreen;
