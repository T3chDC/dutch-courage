import React, { useState } from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

const SelectFilesModal = ({
  isSelectFileModalVisible,
  setIsSelectFileModalVisible,

  // isImageChooseModalVisible,
  // setIsImageChooseModalVisible,
  setSelectedImage,
}) => {
  //Function to Open Camera
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setIsSelectFileModalVisible(false);
    }
  };

  //Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setIsSelectFileModalVisible(false);
    }
  };

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      isVisible={isSelectFileModalVisible}
      onBackdropPress={() => setIsSelectFileModalVisible(false)}
      onRequestClose={() => {
        setIsSelectFileModalVisible(false);
      }}
    >
      <View className="flex-1 justify-end items-center">
        <View className="w-[100vw] h-[220] rounded flex-col justify-between items-center py-5 bg-white">
          <TouchableOpacity
            className="bg-[#22A6B3] rounded-md w-80 h-12 flex-row justify-center items-center"
            onPress={() => openCamera()}
          >
            <Text className="text-white font-bold">Take a picture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#22A6B3] rounded-md w-80 h-12 flex-row justify-center items-center"
            onPress={() => pickImage()}
          >
            <Text className="text-white font-bold">Send from gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border-2 border-[#22A6B3] rounded-md w-80 h-12 flex-row justify-center items-center">
            <Text
              className="text-[#22A6B3] font-bold"
              onPress={() => setIsSelectFileModalVisible(false)}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectFilesModal;
