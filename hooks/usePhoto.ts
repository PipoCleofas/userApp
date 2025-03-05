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
  const [passworderr, setPasswordErr] = useState<string | null>(null)
  const [id, setID] = useState<any>();

  
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
    if (!imageUri1 || !imageUri2 || !imageUri3) {
      setImageError('Provide the required photos');
      return;
    }
  
    if (!id) {
      setImageError('Provide ID type');
      return;
    }

    try {
      // Retrieve UserID from AsyncStorage
      const userID = await AsyncStorage.getItem('firstId');
      if (!userID) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }
  
      // Upload images to Cloudinary one by one
      const uploadToCloudinary = async (uri: string) => {
        const data = new FormData();
        data.append('file', { uri, type: 'image/jpeg', name: 'photo.jpg' } as any);
        data.append('upload_preset', 'tsuCapstone'); 
        data.append('cloud_name', 'dsh9cyznf');
      
        try {
          const response = await fetch('https://api.cloudinary.com/v1_1/dsh9cyznf/image/upload', {
            method: 'POST',
            body: data,
          });
      
          const result = await response.json();
          console.log('Cloudinary Upload Result:', result); // Debugging
          return result.secure_url; // Return Cloudinary URL
        } catch (error) {
          console.error('Cloudinary Upload Error:', error);
          throw new Error('Failed to upload to Cloudinary');
        }
      };
      
  
      // Upload all images and get their URLs
      const photo1_url = await uploadToCloudinary(imageUri1);
      const photo2_url = await uploadToCloudinary(imageUri2);
      const photo3_url = await uploadToCloudinary(imageUri3);
  
      // Prepare data for API request
      const requestBody = { userID, photos: [photo1_url, photo2_url, photo3_url] };
  
      // Send URLs to Express backend
      await axios.post('https://express-production-ac91.up.railway.app/photo/upload', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      navigation.navigate('CitizenLogin' as never);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Failed to upload images');
    }
  };
  






  const uploadProfile = async () => {
    console.log(password! + repassword);
  
    if (!password) {
      setImageError('Fill in the required fields.');
      return;
    }
  
    const err = validatePassword(password);
    if (err) {
      setImageError(err);
      return;
    }
  
    if (repassword !== null && password !== repassword) {
      setImageError('Passwords do not match.');
      return;
    }
  
    if (repassword == null) {
      setImageError('Reenter your password');
      return;
    }
  
    const userID = await AsyncStorage.getItem('firstId');
    if (!userID) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }
  
    await updateUserProfile(username ?? 'Lebron James', password ?? 'SamplePassword');
  
    // Ensure image is selected
    if (!imageUri4) {
      Alert.alert('Error', 'Please select an image.');
      return;
    }
  
    // Prepare FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('photo4', {
      uri: imageUri4,
      type: 'image/jpeg',
      name: 'photo4.jpg',
    } as any);
    formData.append('userID', userID);
  
    console.log('Uploading image:', formData);
  
    try {
      // Make the POST request to the `/upload-single` route
      const response = await axios.post(
        `https://express-production-ac91.up.railway.app/photo/upload-single`, 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      if (response.status === 200) {
        console.log('Image uploaded successfully:', response.data.imageUrl);
        navigation.navigate('CitizenPhoto' as never);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert('Upload Failed', 'Failed to upload the profile image.');
    }
  };
  
  
    const onPasswordChange = (password: string) => {
      setPassword(password);
      console.log(password);
  
      const err = validatePassword(password);
  
      if (err) {
          setPasswordErr(err);
          console.log(`Error on password: ${err}`);
          return false;
      } else {
         setPasswordErr(null); // Clear the error if no issues
          console.log("No errors on password");
          return true;
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
    onPasswordChange,
    repassword,
    passworderr,
    setID,
    id
  };
};

export default usePhotoPicker;