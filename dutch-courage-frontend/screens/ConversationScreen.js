import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import SwipeButton from "rn-swipe-button";

const ConversationScreen = () => {
  // Navigation hook
  const navigation = useNavigation();
  // Redux Dispatch hook
  const dispatch = useDispatch();

  // Functionality when user is trying togo back to profile screen
  const backAction = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-black flex-1 justify-start items-center relative">
      <TouchableOpacity
        className="absolute top-12 left-4 flex-row items-center"
        onPress={() => backAction()}
      >
        <Text className="text-white text-base top-[-1]">{"<"}</Text>
      </TouchableOpacity>

      <View className="flex flex-row absolute items-left left-8 top-10">
        <View className="w-[60] justify-center items-center">
          <View className="w-[42] h-[42] rounded-full bg-[#FCFCFE] ">
            {/* Image will appear here */}
          </View>
        </View>

        <View className="w-[220] justify-center items-left">
          <Text className="text-white">User Name</Text>
        </View>
      </View>

      <View className="absolute">
        <View className="mt-[95] flex-1 h-[1] w-[400] bg-[#22A6B3]"></View>
      </View>

    </View>
  );
};

export default ConversationScreen;
