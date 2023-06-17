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
      <View className="flex-1 justify-end items-center">
        <View className="w-[100vw] h-[220] rounded flex-col justify-between items-center py-5 bg-white">
          <TouchableOpacity className="bg-[#22A6B3] rounded-md w-80 h-12 flex-row justify-center items-center">
            <Text className="text-white font-bold">Take a picture</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#22A6B3] rounded-md w-80 h-12 flex-row justify-center items-center">
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
