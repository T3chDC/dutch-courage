import { View, Text, TextInput, Image, TouchableOpacity, BackHandler } from "react-native";
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

const LocationFinderScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

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
    const [imageUrl, setImageUrl] = useState("");
    const [userName, setUserName] = useState("");
    const [topInterests, setTopInterests] = useState([]);
    const [rating, setRating] = useState(5);
    const [location, setLocation] = useState("");

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
            setImageUrl(meUser.imageUrl);
            setUserName(meUser.userName);
            setTopInterests(meUser.topInterests);
            setRating(meUser.rating);
            setLocation(meUser.location);
        } else {
            dispatch(getMeUser());
        }
    }, [isMeGetError, isMeGetSuccess, meGetErrorMessage, dispatch]);

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

                <Text className="text-white text-sm font-bold right-[95]">
                    Search Your Location
                </Text>


                <TouchableOpacity>
                    <TextInput
                        placeholder='&nbsp; Find Me'
                        placeholderTextColor='#fff'
                        keyboardType='default'
                        className='text-base w-80 h-10 flex-row justify-start items-center mt-7 border-2 rounded-xl border-[#22A6B3] text-sm px-1'
                    />
                </TouchableOpacity>
            </View>

            <View className='mt-[60]'>
                <View className='left-12 mt-3'>
                    <Text className='text-white text-base font-bold'>Jax Bar</Text>
                    <Text className='text-white text-sm'>5-7 Brunswick Rd, Gloucester</Text>
                </View>
                <View className='flex flex-row left-12 mt-[15] h-[1] w-[400] bg-[#22A6B3]'>
                </View>

                <View className='left-12 mt-3'>
                    <Text className='text-white text-base font-bold'>Jax Bar</Text>
                    <Text className='text-white text-sm'>5-7 Brunswick Rd, Gloucester</Text>
                </View>
                <View className='flex flex-row left-12 mt-[15] h-[1] w-[400] bg-[#22A6B3]'>
                </View>
            </View>

        </View>
    );
};

export default LocationFinderScreen;
