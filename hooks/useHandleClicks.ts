import axios from "axios";
import { useNavigation } from "expo-router";
import useLocation from "./useLocation";
import { useState } from "react";
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
  const [markers, setMarkers] = useState<MarkerType[] | null>([]); // State to store markers

    const {latitude, longitude, fetchLocation, arrivalTime, location, setArrivalTime} = useLocation();
  

  


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


    const handleBackButtonOnSignupPress = () => {
        navigation.navigate('index' as never);
    }

    const handleLoginButtonPress = () => {
        navigation.navigate('(tabs)' as never);
    }

    const handleBackButtonInCitizenPhotoPress = () => {
        navigation.navigate("UsernamePhoto" as never)
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
        const station = serviceChosen + " Station"
        console.log("Station chosen: " + station)
        const response = await fetch(`https://express-production-ac91.up.railway.app/marker/getService/${station}`);
        const data = await response.json();
        console.log("Data: " + data)
        if (Array.isArray(data)) {
          let filteredMarkers: MarkerType[] = []; 
          let closestDistance: number | null = null;
    
          if (location) {
            data.forEach((marker: MarkerType) => {
              const distance = haversineDistance(
                location.coords.latitude,
                location.coords.longitude,
                marker.latitude,
                marker.longitude
              );
    
              if (distance <= 14000) {
                filteredMarkers.push(marker);
    
                if (closestDistance === null || distance < closestDistance) {
                  closestDistance = distance;
                }
              } else {
                console.log('Distance is greater than 14 km, skipping marker');
              }
            });
    
            // Check if there are any markers within 14 km
            if (filteredMarkers.length > 0) {
              const responseRider = await fetch(`https://express-production-ac91.up.railway.app/marker/getRider/${station}`);
              const dataRider = await responseRider.json();
              console.log("DataRider: ", dataRider)
              const res = [...filteredMarkers, ...dataRider];
              setMarkers(res);
              console.log('All station with rider fetched!!')

            } else {
              // Fallback fetch: No markers within 14 km, so use the backend route to get a station
              const fallbackResponse = await fetch(`https://express-production-ac91.up.railway.app/marker/getRider/${station}`);
              const fallbackData = await fallbackResponse.json();
              console.log(fallbackData, "Fallback station data received");
    
              // Check if the backend returned any fallback stations
              if (Array.isArray(fallbackData) && fallbackData.length > 0) {
                setMarkers(fallbackData);
                setArrivalTime('Using fallback station data');
              } else {
                setArrivalTime('No nearby or fallback stations available');
              }
            }
          }
        } else {
          console.error('Invalid data format from API');
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
        console.error('Failed to load markers');
      }
    };
    
    
    
    
    
    
    const updateStatusRequest = async (status: string, userId: number) => {
      try {
          const response = await axios.put(`https://express-production-ac91.up.railway.app/servicerequest/updateRequest/${status}`, {
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

    const EmergencyAssistanceRequest = async (requestType: string, markeremoji: any, imageWidth: number = 65, imageHeight: number = 70, requestStatus: string | null, cancelParams?: string) => {

      setMarkerEmoji(markeremoji);
      setMarkerImageSize({ width: imageWidth, height: imageHeight });
    
      const USERID = await AsyncStorage.getItem('id');

      const address = await AsyncStorage.getItem('address');

      try {

        if (requestType === 'Canceled Service') {
          if (USERID !== null) {
            await updateStatusRequest(requestStatus ?? '', parseInt(USERID));
            
            /*
            const markerUpdateResponse = await axios.put(`https://express-production-ac91.up.railway.app/marker/updateMarkerTitle/${USERID}/${"all"}`, {
              newTitle: 'Cancelled Service Assistance Request'
            }, {
              headers: {
                  'Content-Type': 'application/json',
              },
              
            });
            */
           
            setMarkers(null)
          } else {
            console.error("USERID is null");
          }
          
        }
        
        switch(cancelParams){
          case "BFP":
            const updateBFP = await axios.put(`https://express-production-ac91.up.railway.app/marker/updateMarkerTitle/${USERID}/${"BFP"}`, {
              newTitle: 'Cancelled Service Assistance Request'
            }, {
              headers: {
                  'Content-Type': 'application/json',
              },
            });
            break;
            case "PNP":
              const updatePNP = await axios.put(`https://express-production-ac91.up.railway.app/marker/updateMarkerTitle/${USERID}/${"PNP"}`, {
                newTitle: 'Cancelled Service Assistance Request'
              }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                
              });
              break;
              case "Medical":
            const updateMedical = await axios.put(`https://express-production-ac91.up.railway.app/marker/updateMarkerTitle/${USERID}/${"Medical"}`, {
              newTitle: 'Cancelled Service Assistance Request'
            }, {
              headers: {
                  'Content-Type': 'application/json',
              },
              
            });
            break;

            case "PDRRMO":
            const updatePDRRMO = await axios.put(`https://express-production-ac91.up.railway.app/marker/updateMarkerTitle/${USERID}/${"PDRRMO"}`, {
              newTitle: 'Cancelled Service Assistance Request'
            }, {
              headers: {
                  'Content-Type': 'application/json',
              },
              
            });
            break;

        }

        // for marker submit
        let station: string;

        switch(requestType){
          case "BFP":
            station = "bfpsanisidromarker";
            break;
          case "PNP":
            station = "pnpsanisidromarker";
            break;
          case "Medical":
            station = "talonmarker";
            break;
          case "PDRRMO":
            station = "pdrrrmomarker";
            break;
          case "Canceled Service":
            station = "bfpsanisidromarker";
            break;
          default:
            throw new Error(`Unhandled requestType: ${requestType}`);
        }

        const gender = await AsyncStorage.getItem('gender')

        console.log("Latest station: " + station)
        const markerResponse = await axios.post('https://express-production-ac91.up.railway.app/marker/submit', {
          latitude,
          longitude,
          title: `${requestType} Assistance Request`,
          description: "Emergency Assistance Request",
          UserID: USERID,
          Gender: gender,
          Station: station
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let spUsername;

        switch(requestType){
          case "BFP":
            spUsername = "BFP BRGY. SAN ISIDRO";
            break;
          case "PNP":
            spUsername = "PNP BRGY. SAN ISIDRO";
            break;
          case "Medical":
            spUsername = "TALON GENERAL HOSPITAL";
            break;
          case "PDRRMO":
            spUsername = "PDRRMO Station";
            break;
          default:
            throw new Error(`Unhandled requestType: ${requestType}`);
        }

        console.log("SP Username: ", spUsername)
        // for getting the id of the SP
        const spResponse = await axios.get(`https://express-production-ac91.up.railway.app/serviceprovider/getSP`, {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            username: spUsername,
          },
        });

        console.log("Going SP ID")
        const spId = await spResponse.data.userId.toString();

        // spID undefined
        console.log("SP ID: ", spId)
        await AsyncStorage.setItem('spID', spId)

        console.log("Done SP ID")

        // convo submit
        const convoResponse = await axios.post('https://express-production-ac91.up.railway.app/messaging/submitConvo', {
              sender_id: USERID,
              receiver_id: spId,
              message: 'Need help'
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const conversation_id = await AsyncStorage.setItem('conversation_id', convoResponse.data.conversation_id)

        
        
        console.log('Marker submission success:', markerResponse.data);
        
        let  username = await AsyncStorage.getItem('username')
        console.log(username)

        const serviceRequestResponse = await axios.post('https://express-production-ac91.up.railway.app/servicerequest/submit', {
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
    
    
      
  function handleBackButtonOnUsernamePhotoPress(){
    navigation.navigate('CitizenSignup' as never)
  }
    
      
  
    

   
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

    
    
    
    
    

    return {
        handleCitizenLoginPress,
        handleCitizenSignUpPress,

        handleBackButtonOnSignupPress,
        handleLoginButtonPress,
        handleBackButtonInCitizenPhotoPress,
        handleLoginButtonInSignupAsCitizenPress,
        EmergencyAssistanceRequest,

        markerEmoji,
        markerImageSize,
        markers,
        handleBackButtonOnUsernamePhotoPress,
    }


}

export default useHandleClicks;