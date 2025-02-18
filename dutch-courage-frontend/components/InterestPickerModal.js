import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";
import React, { useState } from "react";
import interests from "../assets/staticData/interests";
import Toast from "react-native-toast-message";
import ToastConfig from "../utils/toastConfig";

const InterestPickerModal = ({
  isInterestModalVisible,
  setIsInterestModalVisible,
  setTopInterests,
}) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  //Function to handle interest selection
  const handleInterestSelection = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter(
          (selectedInterest) => selectedInterest !== interest
        )
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  //Function to handle interest submit
  const handleInterestSubmit = () => {
    if (selectedInterests.length < 3) {
      Toast.show({
        type: "error",
        text1: "Please select at least 3 interests",
        visibilityTime: 3000,
        autoHide: true,
      });
    } else {
      setTopInterests(selectedInterests);
      setIsInterestModalVisible(false);
    }
  };

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      isVisible={isInterestModalVisible}
      onBackdropPress={() => setIsInterestModalVisible(false)}
      onRequestClose={() => {
        setIsInterestModalVisible(false);
      }}
      avoidKeyboard={true}
    >
      <View className="flex-1 justify-center items-center">
        <View className=" absolute top-4 w-[100vw] h-[80vh] rounded-2xl justify-start items-center py-5">
          <Text className="text-white text-base font-semibold">
            Choose your interests
          </Text>
          <ScrollView
            className="w-80 h-40 mt-4"
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                className={`${
                  selectedInterests.includes(interest)
                    ? "bg-[#3fe7f6]"
                    : "bg-[#E8E8E8]"
                } w-32 h-12 flex-row justify-center items-center rounded-full mt-4 mx-2`}
                // onPress={() => handleInterestSelection(interest)}
                onPress={() =>
                  selectedInterests.includes(interest)
                    ? handleInterestSelection(interest)
                    : selectedInterests.length < 3
                    ? handleInterestSelection(interest)
                    : Toast.show({
                        type: "error",
                        text1: "Limit exceeded!! Select only 3..",
                        visibilityTime: 3000,
                        autoHide: true,
                      })
                }
              >
                <Text className="text-base font-semibold">{interest}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            className="bg-[#22A6B3] w-80 h-12 flex-row justify-center items-center mt-4"
            onPress={handleInterestSubmit}
          >
            <Text className="text-base font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast config={ToastConfig} />
    </Modal>
  );
};

export default InterestPickerModal;
