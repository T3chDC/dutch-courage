import React from "react";
import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ConfirmSelectedFileModal = ({
  selectedImage,
  setSelectedImage,

  isConfirmSelectedFileModalVisible,
  setIsConfirmSelectedFileModalVisible,
}) => {
  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      backdropOpacity={0.9}
      isVisible={isConfirmSelectedFileModalVisible}
      onBackdropPress={() => null}
      onRequestClose={() => {
        setIsConfirmSelectedFileModalVisible(false);
      }}
      avoidKeyboard={true}
    >
      <View className="flex-1 justify-center items-center">
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 300, height: 300 }}
        />

        <TouchableOpacity className="bg-[#22A6B3] w-60 mt-5 rounded-md justify-center items-center">
          <Text
            className="text-white p-3"
            // onPress={() => }
          >
            Send
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#22A6B3] w-60 mt-5 rounded-md justify-center items-center"
          onPress={() => setIsConfirmSelectedFileModalVisible(false)}
        >
          <Text className="text-white p-3">Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ConfirmSelectedFileModal;
