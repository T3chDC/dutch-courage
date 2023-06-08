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
        className="absolute top-10 left-4 flex-row items-center"
        onPress={() => backAction()}
      >
        {/* <ChevronLeftIcon size={20} color='white' /> */}
        <Text className="text-white text-base top-[-1]">{"< Thor"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConversationScreen;
