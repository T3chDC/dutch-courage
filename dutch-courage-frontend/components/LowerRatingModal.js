import { View, Text, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "@rneui/themed";

const LowerRatingModal = ({ modalVisible, setModalVisible }) => {
  const [chekcTest, setCheckTest] = useState(false);
  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      onRequestClose={() => {
        setModalVisible(false);
      }}
      // avoidKeyboard={true}
    >
      <View className="flex-1 justify-center items-center">
        <View className="absolute w-[80vw] h-[30vh] rounded-2xl flex-row justify-center bg-[#3fe7f6]">
          <View className="absolute w-[60vw] h-[6vh] flex-row justify-center items-center mt-5 rounded-2xl bg-white">
            <Text className="text-[#808080]">
              Please provide a reason for lower star rating
            </Text>
          </View>
        </View>

        <View className="w-[60vw] h-[10vh] flex-row justify-start top-[-15]">
          <View className="flex">
            <CheckBox
              checked={chekcTest}
              checkedIcon="circle"
              checkedColor="#808080"
              uncheckedIcon="circle"
              uncheckedColor="white"
              onPress={() => setCheckTest(!chekcTest)}
              title="Underage"
              textStyle={{ color: "#808080" }}
              containerStyle={{
                backgroundColor: "transparent",
              }}
            ></CheckBox>

            <CheckBox
              checked={chekcTest}
              checkedIcon="circle"
              checkedColor="#808080"
              uncheckedIcon="circle"
              uncheckedColor="white"
              onPress={() => setCheckTest(!chekcTest)}
              title="Spam"
              textStyle={{ color: "#808080" }}
              containerStyle={{
                backgroundColor: "transparent",
              }}
            ></CheckBox>
          </View>
        
          <View className="">
            <CheckBox
              checked={chekcTest}
              checkedIcon="circle"
              checkedColor="#808080"
              uncheckedIcon="circle"
              uncheckedColor="white"
              onPress={() => setCheckTest(!chekcTest)}
              title="Soliciting"
              textStyle={{ color: "#808080" }}
              containerStyle={{
                backgroundColor: "transparent",
              }}
            ></CheckBox>

            <CheckBox
              checked={chekcTest}
              checkedIcon="circle"
              checkedColor="#808080"
              uncheckedIcon="circle"
              uncheckedColor="white"
              onPress={() => setCheckTest(!chekcTest)}
              title="Other"
              textStyle={{ color: "#808080" }}
              containerStyle={{
                backgroundColor: "transparent",
              }}
            ></CheckBox>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LowerRatingModal;
