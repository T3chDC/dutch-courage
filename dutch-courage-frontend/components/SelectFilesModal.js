import React, { useState } from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity } from "react-native";

const SelectFilesModal = ({ 
    isSelectFileModalVisible,
    setIsSelectFileModalVisible,
 }) => {
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
      <View className="flex-1 justify-center items-center">
        <View className="w-[100vw] h-[200] rounded-2xl flex-col justify-between items-center py-5 bg-gray-800">
            <TouchableOpacity
                className="bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center"
            >
                <Text className="text-white">Take a picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center"
            >
                <Text className="text-white">Take a picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-[#22A6B3] rounded-full w-40 h-12 flex-row justify-center items-center"
            >
                <Text className="text-white">Take a picture</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectFilesModal;
