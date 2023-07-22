import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as Progress from "react-native-progress";
import SwipeButton from "rn-swipe-button";
import Toast from "react-native-toast-message";
import BlockModal from "../components/BlockModal";
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
import RatingStars from "../components/RatingStars";
import { BACKEND_URL } from "../config";

const UsersNearbyScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  //Local state variables
  const [report, setReport] = useState("");
  const [reportCount, setReportCount] = useState(0);
  const [showBlockModal, setShowBlockModal] = useState(false);

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

      <View className="top-[50] justify-evenly items-center ">
        <Image
          source={require("../assets/projectImages/TempLogo1.png")}
          className=""
        />

        <Text className="text-white text-xl font-bold right-[120]">
          Around You
        </Text>

        <View className="justify-start items-start w-[350] flex-row mt-4">
          <Image
            source={require("../assets/projectImages/avatarPlaceholder.png")}
            className="w-[50] h-[50] rounded-full"
            resizeMode="cover"
          />

          <View className="flex flex-row">
            <View className="flex flex-col w-[220]">
              <Text className="text-white text-xl left-5">User Name</Text>

              <Text className="mt-1 text-[#808080] text-muted left-5">
                My Hobbies, Mera Hobbies, Mein Hobbies
              </Text>
            </View>
          </View>

          <View className="right-[70px] flex flex-row">
            {/* Star */}
            <Image
              source={require("../assets/projectImages/starFull.png")}
              className="w-6 h-6 mx-1"
            />
            <Text className="text-white text-xl">2.5</Text>

            {/* Block Button */}
            <View className="bottom-[5] ml-2">
              <SwipeButton
                title="Block"
                titleColor="white"
                titleFontSize={15}
                titleStyles={{}}
                swipeSuccessThreshold={50}
                height={22}
                width={80}
                onSwipeSuccess={() =>
                  // Toast.show({
                  //   type: "success",
                  //   text1: "You have successfully blocked the user",
                  //   visibilityTime: 3000,
                  // })
                  setShowBlockModal(true)
                }
                thumbIconBackgroundColor="white"
                thumbIconBorderColor="white"
                railBackgroundColor="#FF7F50"
                railBorderColor="#FF7F50"
                railFillBackgroundColor="rgb(128, 128, 128)"
                railFillBorderColor="#808080"
              />
            </View>

            {/* Block Modal */}
            <BlockModal
              modalVisible={showBlockModal}
              setModalVisible={setShowBlockModal}
              report={report}
              setReport={setReport}
              reportCount={reportCount}
              setReportCount={setReportCount}
            />
          </View>
        </View>

        <View className="justify-start items-start w-[350] flex-row mt-4">
          <Image
            source={require("../assets/projectImages/avatarPlaceholder.png")}
            className="w-[50] h-[50] rounded-full"
            resizeMode="cover"
          />

          <View className="flex flex-row">
            <View className="flex flex-col w-[220]">
              <Text className="text-white text-xl left-5">User Name</Text>

              <Text className="mt-1 text-[#808080] text-muted left-5">
                My Hobbies, Mera Hobbies, Mein Hobbies
              </Text>
            </View>
          </View>

          <View className="right-[70px] flex flex-row">
            {/* Star */}
            <Image
              source={require("../assets/projectImages/starFull.png")}
              className="w-6 h-6 mx-1"
            />
            <Text className="text-white text-xl">2.5</Text>

            {/* <Text className='text-white'>Block Block Block</Text> */}
            <View className="bottom-[5] ml-2">
              <SwipeButton
                title="Block"
                titleColor="white"
                titleFontSize={15}
                titleStyles={{}}
                swipeSuccessThreshold={50}
                height={22}
                width={80}
                onSwipeSuccess={() =>
                  Toast.show({
                    type: "success",
                    text1: "You have successfully blocked the user",
                    visibilityTime: 3000,
                  })
                }
                thumbIconBackgroundColor="white"
                thumbIconBorderColor="white"
                railBackgroundColor="#FF7F50"
                railBorderColor="#FF7F50"
                railFillBackgroundColor="rgb(128, 128, 128)"
                railFillBorderColor="#808080"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UsersNearbyScreen;
