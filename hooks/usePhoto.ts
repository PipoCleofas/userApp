import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import useHandleClicks from './useHandleClicks';
import { useNavigation } from 'expo-router';
import { Alert } from 'react-native';
import axios from 'axios';
import { CameraType, useCameraPermissions, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {updateUserProfile} from '@/app/services/userservice'
import {validatePassword} from '@/app/utils/validateUser'

const usePhotoPicker = () => {
  const navigation = useNavigation();
  const [imageUri1, setImageUri1] = useState<string | null>(null);
  const [imageUri2, setImageUri2] = useState<string | null>(null);
  const [imageUri3, setImageUri3] = useState<string | null>(null);
  const [imageUri4, setImageUri4] = useState<string | null>(null);
  const [imageError,setImageError] = useState<string | null>(null)
  const [usernamePhotoError, setUsernamePhotoError] = useState<string | null>(null)
  const [username,setUsername] = useState<string | null>()
  const [password,setPassword] = useState<string | null>(null)
  const [repassword, setrepassword] = useState<string | null>(null)
  
  const pickImage = async (setImageUri: React.Dispatch<React.SetStateAction<string | null>>) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  // Function to capture an image using the camera
  const captureImage = async (setImageUri: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
      }
    } else {
      Alert.alert('Camera permission is required to use the camera');
    }
  };

  const uploadAllImages = async () => {
    if(!imageUri1 || !imageUri2 || !imageUri3){
      setImageError('Provide the required photos');
      return;
    }

    const formData = new FormData();
    const images = [
      { uri: imageUri1, name: 'photo1' },
      { uri: imageUri2, name: 'photo2' },
      { uri: imageUri3, name: 'photo3' },
    ];
    console.log(images)
    // Append each image to the formData if it has been selected
    images.forEach(({ uri, name }) => {
      if (uri) {
        formData.append('photos', {
          uri,
          type: 'image/jpeg',
          name: `${name}.jpg`,
        } as any);
      }
    });
  
    try {
      // Retrieve UserID from AsyncStorage
      const userID = await AsyncStorage.getItem('firstId');
      if (!userID) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }
  
      // Append UserID to formData
      formData.append('userID', userID);
      console.log(formData)
      // Make the POST request
      await axios.post('https://express-production-ac91.up.railway.app/photo/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      navigation.navigate('CitizenLogin' as never)
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'Failed to upload images');
    }
  };






  const uploadProfile = async () => {
    //navigation.navigate('CitizenPhoto' as never)
    console.log(password! + repassword)

    if (!password) {
      setImageError('Fill in the required fields.');
      return 0;
    }
  
    const err = validatePassword(password)
    if(err){
      setImageError(err)
      return;
    }
    
    if (repassword !== null && password !== repassword) {
      setImageError("Passwords do not match.")
    }

    if(repassword == null){
      setImageError("Reenter your password")

    }

    const userID = await AsyncStorage.getItem('firstId');
      if (!userID) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }
    
    await updateUserProfile(username ?? 'Lebron James', password ?? 'SamplePassword');
    

    // photo
    const formData = new FormData();
    formData.append('photo4', {
      uri: imageUri4,
      type: 'image/jpeg',
      name: 'photo4.jpg',
    } as any);
    formData.append('userID', userID);
    console.log(formData)

    try {
      const userIDa = await AsyncStorage.getItem('firstId');
      if (!userIDa) {
        return;
      }
  
      // Make the PUT request
      const response  = await axios.put(
        `https://express-production-ac91.up.railway.app/photo/photos/${userIDa}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      
      if(response.status  === 200){
        navigation.navigate('CitizenPhoto' as never)
      }
  
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert('Upload Failed', 'Failed to upload the profile image');
    }
  };
  
  
  return {
    imageError,
    imageUri1,
    imageUri2,
    imageUri3,
    imageUri4,
    uploadAllImages,
    pickImage,
    captureImage,
    setImageUri1,
    setImageUri2,
    setImageUri3,
    setImageUri4,
    uploadProfile,
    setPassword,
    setrepassword,
    setUsername,
    password,
    repassword
  };
};

export default usePhotoPicker;