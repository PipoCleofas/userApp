import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, Modal } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import IDS from '@/components/ID';
import usePhoto from '@/hooks/usePhoto'
import useHandleClicks from '@/hooks/useHandleClicks'
import useDataInput from '@/hooks/useDataInput'

const ImageUploadScreen = () => {

  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);

  const { handleBackButtonInCitizenPhotoPress } = useHandleClicks();

  const {
    imageUri1,
    imageUri2,
    imageUri3,
    uploadAllImages,
    pickImage,
    captureImage,
    setImageUri1,
    setImageUri2,
    setImageUri3,
    imageError,
    setID,
    id
    } = usePhoto();

  const {state} = useDataInput();

  return (
    <View style={styles.container}>
      <Modal
      animationType="fade"
      transparent={true}
      visible={modal1Visible}
      onRequestClose={() => {
        setModal1Visible(!modal1Visible);
      }}>

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => pickImage(setImageUri1)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Select Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => captureImage(setImageUri1)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Open Camera</Text>
          </TouchableOpacity>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModal1Visible(!modal1Visible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
      </Modal>

      <Modal
      animationType="fade"  
      transparent={true}
      visible={modal2Visible}
      onRequestClose={() => {
        setModal2Visible(!modal2Visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => pickImage(setImageUri2)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Select Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => captureImage(setImageUri2)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Open Camera</Text>
          </TouchableOpacity>         
          
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModal2Visible(!modal2Visible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
      </Modal>

      <Modal
      animationType="fade"
      transparent={true}
      visible={modal3Visible}
      onRequestClose={() => {
        setModal3Visible(!modal3Visible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => pickImage(setImageUri3)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Select Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => captureImage(setImageUri3)} style={styles.modalButtons}>
            <Text style={styles.modalText}>Open Camera</Text>
          </TouchableOpacity>         
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModal3Visible(!modal3Visible)}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
      </Modal>


      <Text style={styles.headerText}>CITIZEN</Text>
      <Text style={[styles.headerText, {marginBottom: 55}]}>ACCOUNT</Text>
      <IDS value={id} onValueChange={setID}/>

      <View style={styles.photoContainer}>
        {/* Front Image Upload */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            onPress={() => setModal1Visible(true)}
            style={styles.uploadBox}
          >
            {imageUri1 ? (
              <Image source={{ uri: imageUri1 }} style={styles.uploadImage} />
            ) : (
              <SimpleLineIcons name="picture" size={40} color="#944547" />
            )}
            <Text style={styles.uploadLabel}>FRONT IMAGE</Text>
            <Text style={styles.uploadButton}>UPLOAD A PHOTO</Text>
          </TouchableOpacity>
        </View>

        {/* Back Image Upload */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            onPress={() => setModal2Visible(true)}
            style={styles.uploadBox}
          >
            {imageUri2 ? (
              <Image source={{ uri: imageUri2 }} style={styles.uploadImage} />
            ) : (
              <SimpleLineIcons name="picture" size={40} color="#944547" />
            )}
            <Text style={styles.uploadLabel}>BACK IMAGE</Text>
            <Text style={styles.uploadButton}>UPLOAD A PHOTO</Text>
          </TouchableOpacity>
        </View>

        {/* Selfie Image Upload */}
        <View style={styles.uploadSection}>
          <TouchableOpacity
            onPress={() => setModal3Visible(true)}
            style={styles.uploadBox}
          >
            {imageUri3 ? (
              <Image source={{ uri: imageUri3 }} style={styles.uploadImage} />
            ) : (
              <SimpleLineIcons name="picture" size={40} color="#944547" />
            )}
            <Text style={styles.uploadLabel}>SELFIE IMAGE</Text>
            <Text style={styles.uploadButton}>UPLOAD A PHOTO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {imageError && <Text style={styles.errorText}>{imageError}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBackButtonInCitizenPhotoPress}>
          <SimpleLineIcons name="arrow-left" size={16} color="white" />
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={uploadAllImages}>
          <Text style={styles.buttonText}>NEXT</Text>
          <SimpleLineIcons name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4DBD7",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a transparent background effect
  },
  modalView: {
    width: '80%', // Adjust modal width
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButtons: {
    backgroundColor: '#944547',
    width: 120,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 7,
  },
  buttonClose: {
    backgroundColor: '#944547', // Match the other buttons for consistency
  },
  textStyle: {
    color: 'white', // Ensures text contrast
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0, // Add spacing above and below
    color: "#944547",
  },
  photoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  uploadSection: {
    alignItems: "center",
  },
  uploadBox: {
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  uploadImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  uploadButton: {
    fontSize: 10,
    color: "#FFFFFF",
    backgroundColor: "#944547",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  backButton: {
    backgroundColor: "#8C1F31",
  },
  nextButton: {
    backgroundColor: "#8C1F31",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
});

export default ImageUploadScreen;