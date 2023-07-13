import { View, Text, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckBox } from "@rneui/themed";
import { TextInput } from "react-native-gesture-handler";

const LowerRatingModal = ({
  modalVisible,
  setModalVisible,

  report,
  setReport,
  reportCount,
  setReportCount,

}) => {
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
        <View className="absolute w-[80vw] h-[40vh] rounded-2xl flex-row justify-center bg-[#3fe7f6]">
          <View className="absolute w-[70vw] h-[6vh] flex-row justify-center items-center mt-5 rounded-2xl bg-white">
            <Text className="text-[#808080]">
              Please provide a reason for lower star rating
            </Text>
          </View>
        </View>

        <View className="w-[60vw] h-[10vh] flex-row top-5">
          <View className="left-[-5]">
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
                marginTop: -10,
              }}
            ></CheckBox>
          </View>

          <View className="left-[-5]">
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
                marginTop: -10,
              }}
            ></CheckBox>
          </View>
        </View>

        <View className="rounded-2xl justify-end bottom-[-28]">
          <View className="w-[70vw] h-[15vh] justify-center items-center mt-5 rounded-2xl bg-white">
            <View>
              <TextInput
                placeholder=""
                keyboardType="default"
                className="text-[#808080] justify-start items-center border-b-2 border-[#999999] w-[50vw] h-[5vh]"
                value={report}
                onChangeText={(text) => {
                  if (text.length <= 40) {
                    setReport(text);
                    setReportCount(text.length);
                  }
                }}
                onEndEditing={() => {
                  setModalVisible(false);
                }}
              ></TextInput>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <View className="w-32 h-8 rounded-xl bg-[#22A6B3] flex-row justify-center items-center top-3">
                <Text className="text-white font-bold">Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LowerRatingModal;
