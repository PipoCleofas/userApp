import axios from "axios";
import { useNavigation } from "expo-router";
import useLocation from "./useLocation";
import useSMS from "./useSMS";
import * as SMS from 'expo-sms';
import {useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the type for the marker object
interface MarkerType {
  latitude: number;
  longitude: number;
  title: string;  // Add the title field
  distance?: number;
}

// request status = 'pending' | 'approved' | 'rejected'
  
const useHandleClicks = () => {
  const [markers, setMarkers] = useState<MarkerType[]>([]); // State to store markers

    const {latitude, longitude, fetchLocation, handleArrivalTime, arrivalTime, location, setArrivalTime} = useLocation();
    const {isAvailable,setResult} = useSMS();
  

  


    const [markerEmoji, setMarkerEmoji] = useState<any>();
    const [markerImageSize, setMarkerImageSize] =useState<{width: any, height: any}> ({ width: 65, height: 70 });

    const [selectedPhotos, setSelectedPhotos] = useState({
      photo1: null,
      photo2: null,
      photo3: null
    });



    const navigation = useNavigation();

    const handleCitizenLoginPress = () => {
        navigation.navigate('CitizenLogin' as never);
    }
    
    const handleCitizenSignUpPress = () => {
        navigation.navigate('CitizenSignup' as never);
    }

    const handleProviderLoginPress = () => {
        navigation.navigate('ProviderLogin' as never);
    }

    const handleProviderSignUpPress = () => {
        navigation.navigate('ProviderSignup' as never);
    }

    const handleBackButtonPress = () => {
        navigation.navigate('Signup' as never);
    }

    const handleLoginButtonPress = () => {
        navigation.navigate('(tabs)' as never);
    }

  

    
    
    const handleBackButtonInCitizenPhotoPress = () => {
        navigation.navigate("CitizenSignup" as never)
    }

    const handleLoginButtonInSignupAsCitizenPress = () => {
       
        navigation.navigate('CitizenLogin' as never);
    };
    
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const toRad = (value: number) => (value * Math.PI) / 180;
      const R = 6371e3; // Radius of Earth in meters
      const φ1 = toRad(lat1);
      const φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1);
      const Δλ = toRad(lon2 - lon1);
    
      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
      return R * c; 
    };
    

    const fetchMarkers = async (serviceChosen: string) => {
      try {
        const response = await fetch(`http://192.168.100.127:3000/marker/getService/${serviceChosen}`);
        const data = await response.json();
    
        if (Array.isArray(data)) {
          setMarkers(data);
    
          if (location) {
            let foundThreshold = null;
    
            data.forEach((marker: MarkerType) => {
              const distance = haversineDistance(
                location.coords.latitude,
                location.coords.longitude,
                marker.latitude,
                marker.longitude
              );
    
              const distanceThresholds = [14000, 13000, 12000, 10000, 8000, 5000, 3000, 1000];
              let calculated = false;
    
              for (const threshold of distanceThresholds) {
                if (distance >= threshold) {
                  console.log(`Distance is ${distance}, calling handleArrivalTime with threshold ${threshold}`);
                  foundThreshold = threshold; // Store the last threshold that matches
                  calculated = true;
                  break;
                }
              }
    
              if (!calculated) {
                console.log('Not calculated');
              }
            });
    
            if (foundThreshold !== null) {
              handleArrivalTime(foundThreshold); // Set arrival time based on the last threshold
            } else {
              setArrivalTime('Calculating'); // Default if no threshold matched
            }
          }
        } else {
          console.error('Error', 'Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
        console.error('Error', 'Failed to load markers');
      }
    };
    
    // Use useEffect to monitor and log arrivalTime when it changes
    useEffect(() => {
      console.log(`Updated arrival time: ${arrivalTime}`);
    }, [arrivalTime]);


  
    const updateStatusRequest = async (status: string, userId: number) => {
      try {
          const response = await axios.put(`http://192.168.100.127:3000/servicerequest/updateRequest/${status}`, {
              UserID: userId
          }, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          console.log('Status updated successfully:', response.data);
      } catch (error) {
          handleAxiosError(error);
      }
  };

    const EmergencyAssistanceRequest = async (requestType: string, markeremoji: any, imageWidth: number = 65, imageHeight: number = 70, requestStatus: string | null) => {

      setMarkerEmoji(markeremoji);
      setMarkerImageSize({ width: imageWidth, height: imageHeight });
    
      const USERID = await AsyncStorage.getItem('id');

      const address = await AsyncStorage.getItem('address');

      try {

        if (requestType === 'Canceled Service') {
          if (USERID !== null) {
            await updateStatusRequest(requestStatus ?? '', parseInt(USERID));
            
            const markerUpdateResponse = await axios.put(`http://192.168.100.127:3000/marker/updateMarkerTitle/${USERID}`, {
              newTitle: 'Cancelled Service Assistance Request'
            }, {
              headers: {
                  'Content-Type': 'application/json',
              },
            });
          } else {
            console.error("USERID is null");
          }
        }
        
        const markerResponse = await axios.post('http://192.168.100.127:3000/marker/submit', {
          latitude,
          longitude,
          title: `${requestType} Assistance Request`,
          description: "Emergency Assistance Request",
          UserID: USERID 
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Marker submission success:', markerResponse.data);
        
        let  username = await AsyncStorage.getItem('username')
        console.log(username)

        const serviceRequestResponse = await axios.post('http://192.168.100.127:3000/servicerequest/submit', {
          UserID: USERID,
          Username: username,
          requesttype: requestType,  
          requeststatus: requestStatus,  
          address: address                  
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const returnedID = await serviceRequestResponse.data.UserID;

        fetchMarkers(requestType)

        console.log("Returned Request Type:", requestType);
        console.log("Returned ID:", returnedID);


        console.log('Service request success:', serviceRequestResponse.data);
        console.log('Request type set to: ' + requestType);

        const markerID = markerResponse.data.id;

      } catch (error: any) {
        handleAxiosError(error);
      }

    };
    
    
      
  
    const RouteAssistance = async () => {
        // Fetch the location
        await fetchLocation();
    
        try {
      
          const markerResponse = await axios.post('http://192.168.100.127:3000/marker/submit', {
             
              title: "Emergency Assistance Request",
              description: "Emergency Assistance Request",
          }, {
              headers: {
              'Content-Type': 'application/json',
              },
          });
          console.log('Marker submission success:', markerResponse.data);
        } catch (error: any) {
        handleAxiosError(error);
        }
    
      
    };
      
  
    

    const sendSMS = async (message: string) => {
        if (!isAvailable) {
        console.log("SMS is not available on this device.");
        return;
        }

        try {
        const { result } = await SMS.sendSMSAsync(
            ['09937839142'],
            message
        );
        setResult(result);
        console.log("SMS sent result:", result);
        } catch (error) {
        console.error("Error sending SMS:", error);
        }
    };

    const handleAxiosError = (error: any) => {
        if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        } else if (error.request) {
        console.error('Request error:', error.request);
        } else {
        console.error('General error:', error.message);
        }
        console.error('Error config:', error.config);
    };

    const onFileChange = (event: any, photoKey: any) => {
      setSelectedPhotos({
        ...selectedPhotos,  // Keep other files unchanged
        [photoKey]: event.target.files[0]  // Update only the selected file
      });
    };

   
    const uriToBlob = async (uri: string): Promise<Blob> => {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    };
    
    const onFileUpload = async (fileUri: string, photoKey: string) => {
      
        const formData = new FormData();
    
       
        const blob = await uriToBlob(fileUri);
    
        
        formData.append('image', blob, `${photoKey}.jpg`);
    
        console.log('Uploading file:', photoKey);
    
        
    };
    
    
    
    

    return {
        handleCitizenLoginPress,
        handleCitizenSignUpPress,
        handleProviderLoginPress,
        handleProviderSignUpPress,
        handleBackButtonPress,
        handleLoginButtonPress,
        handleBackButtonInCitizenPhotoPress,
        handleLoginButtonInSignupAsCitizenPress,
        EmergencyAssistanceRequest,
        RouteAssistance,

        onFileChange,
        onFileUpload,

        markerEmoji,
        markerImageSize,
        markers
        
    }


}

export default useHandleClicks;