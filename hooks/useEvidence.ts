import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type MediaType = 'audio' | 'video' | 'image' | null;

type MediaRecorderHook = {
  videoPermissionStatus: string | null;
  audioPermissionStatus: string | null;
  mediaUri: string | null;
  mediaType: MediaType;
  isPlaying: boolean;
  isRecording: boolean; 
  pickImage: () => Promise<void>;
  captureImage: () => Promise<void>;
  pickVideo: () => Promise<void>;
  recordVideo: () => Promise<void>;
  startRecordingAudio: () => Promise<void>;
  stopRecordingAudio: () => Promise<void>;
  playRecordingAudio: () => Promise<void>;
  clearMedia: () => void;
  handleSubmit: () => Promise<void>;  
};



const useMediaRecorder = (): MediaRecorderHook => {
  const [videoPermissionStatus, setVideoPermissionStatus] = useState<string | null>(null);
  const [audioPermissionStatus, setAudioPermissionStatus] = useState<string | null>(null);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [recordingAudio, setRecordingAudio] = useState<Audio.Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status: videoStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setVideoPermissionStatus(videoStatus);
      setAudioPermissionStatus(audioStatus);
    })();
  }, []);

  const clearMedia = (): void => {
    setMediaUri(null);
    setMediaType(null);
  };

  const pickImage = async (): Promise<void> => {
    clearMedia();
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('image');
    }
  };

  const captureImage = async (): Promise<void> => {
    if (videoPermissionStatus !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    clearMedia();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('image');
    }
  };

  const pickVideo = async (): Promise<void> => {
    if (videoPermissionStatus !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    clearMedia();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('video');
    }
  };

  const recordVideo = async (): Promise<void> => {
    if (videoPermissionStatus !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    clearMedia();

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
      setMediaType('video');
    }
  };

  const startRecordingAudio = async (): Promise<void> => {
    if (audioPermissionStatus !== 'granted') {
      alert('Microphone permission is required!');
      return;
    }
  
    clearMedia();
  
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
  
      setRecordingAudio(recording);
      setIsRecording(true); // 🔴 Update state to indicate recording is active
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };
  

  const stopRecordingAudio = async (): Promise<void> => {
    if (!recordingAudio) return;
  
    try {
      await recordingAudio.stopAndUnloadAsync();
      const uri = recordingAudio.getURI();
      setMediaUri(uri);
      setMediaType('audio');
      setRecordingAudio(null);
      setIsRecording(false); // ⚪ Update state to indicate recording is stopped
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };
  

  const playRecordingAudio = async (): Promise<void> => {
    if (!mediaUri || mediaType !== 'audio') return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: mediaUri });
      setIsPlaying(true);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Failed to play recording', error);
    }
  };

  const handleSubmit = async () => {
    if (!mediaUri) {
      Alert.alert("No file selected!");    
      return;
    }
  
    const UserID = await AsyncStorage.getItem("id");
    if (!UserID) {
      Alert.alert("User ID is missing!");
      return;
    }
  
    try {
      const fileExtension = mediaUri.split(".").pop()?.toLowerCase() || "jpg";
      let fileType;
  
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)) {
        fileType = `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;
      } else if (["mp4", "avi", "mov", "mkv", "webm"].includes(fileExtension)) {
        fileType = `video/${fileExtension}`;
      } else if (["mp3", "wav", "ogg", "aac"].includes(fileExtension)) {
        fileType = `audio/${fileExtension}`;
      } else {
        fileType = "application/octet-stream"; // Unknown type
      }
  
      const file = {
        uri: mediaUri,
        type: fileType,
        name: `upload_${Date.now()}.${fileExtension}`,
      };
  
      const formData = new FormData();
      formData.append("file", file as any); // ✅ Bypass TypeScript error
      formData.append("userID", UserID);
  
      console.log("📂 File Object:", file);
  
      const backendResponse = await fetch(
        "https://express-production-ac91.up.railway.app/photo/uploadE",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
  
      const responseText = await backendResponse.text();
      console.log("📩 Raw Response:", responseText);
  
      try {
        const backendData = JSON.parse(responseText);
        console.log("📦 Parsed Response:", backendData);
  
        if (backendData.success) {
          console.log(1)
        } else {
          console.log(2)

        }
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        console.log(3)

      }
    } catch (error) {
      console.error("🔥 Upload Error:", error);
      console.log(4)
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  

  return {
    videoPermissionStatus,
    audioPermissionStatus,
    mediaUri,
    mediaType,
    isPlaying,
    pickImage,
    captureImage,
    pickVideo,
    recordVideo,
    startRecordingAudio,
    stopRecordingAudio,
    playRecordingAudio,
    clearMedia,
    isRecording,
    handleSubmit,
  };
};

export default useMediaRecorder;
