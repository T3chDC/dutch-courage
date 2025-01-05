import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";

const OtherUserGalleryImageViewerModal = ({
  isVisible,
  setIsVisible,
  galleryImage1Url,
  //   setGalleryImage1Url,
  galleryImage2Url,
  //   setGalleryImage2Url,
  galleryImage3Url,
  //   setGalleryImage3Url,
}) => {
  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      backdropOpacity={0.9}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onRequestClose={() => {
        setIsVisible(false);
      }}
      avoidKeyboard={true}
    >
      <View className="flex-1 justify-center items-center">
        <Swiper
          style={{ height: 800 }}
          showsButtons={true}
          showsPagination={false}
          loop={false}
        >
          {galleryImage1Url && (
            <View className="flex-1 justify-center items-center">
              {/* <Image source={{ uri: galleryImage1Url }}></Image> */}
              <Image
                source={{ uri: galleryImage1Url }}
                style={{ width: 300, height: 300 }}
              />
            </View>
          )}

          {galleryImage2Url && (
            <View className="flex-1 justify-center items-center">
              {/* <Image source={{ uri: galleryImage2Url }}></Image> */}
              <Image
                source={{ uri: galleryImage2Url }}
                style={{ width: 300, height: 300 }}
              />
            </View>
          )}

          {galleryImage3Url && (
            <View className="flex-1 justify-center items-center">
              {/* <Image source={{ uri: galleryImage3Url }}></Image> */}
              <Image
                source={{ uri: galleryImage3Url }}
                style={{ width: 300, height: 300 }}
              />
            </View>
          )}
        </Swiper>
      </View>
    </Modal>
  );
};

export default OtherUserGalleryImageViewerModal;
