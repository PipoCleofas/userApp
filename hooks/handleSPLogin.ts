import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function useHandleLogin(){
    const [loginError, setLoginError] = useState<string | null>(null)
    let [uname,setUname] = useState<null | string>(null);
    let [password,setPassword] = useState<null | string>(null);
    const [markerEmoji, setMarkerEmoji] = useState<any>();
    const [markerUnameEmoji, setMarkerUnameEmoji] = useState<any>();
    const [serviceRequests, setServiceRequests] = useState<any>();

    const [markerImageSize, setMarkerImageSize] =useState<{width: any, height: any}> ({ width: 60, height: 60 });
    const [transferItems, setTransferItems] = useState<{ id: number; label: string }[]>([]);

    const transferableItems = useRef<{ id: number; label: string }[]>([]);
    
    const navigation = useNavigation();

    const onUnameChange = (text: string) => {
        setUname(text);
    }

    const onPasswordChange = (text: string) => {
        setPassword(text)
    }

    const onProviderLoginPress = () => {
      navigation.navigate('ProviderLogin' as never)
    }

    function getFirstString(input: string): string {
      const medicalKeywords = ['DOCTORS', 'HOSPITAL', 'GENERAL', 'PROVINCIAL'];
      const words = input.split(' ');
  
      if (words.some(word => medicalKeywords.includes(word.toUpperCase()))) {
          return 'Medical';
      }
  
      return words[0];
  }
  
  const updateTransferItems = (username: string) => {
    let items: string[] = [];

    switch (username) {
      case "PNP BRGY. SAN ISIDRO":
        items = [
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "BFP BRGY. SAN ISIDRO",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "PNP BRGY. MABINI":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "PNP HILARIO STREET":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "TALON GENERAL HOSPITAL":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "CENTRAL LUZON DOCTORS HOSPITAL":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "TARLAC PROVINCIAL HOSPITAL":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "BFP BRGY. SAN ISIDRO":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN NICOLAS",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "BFP BRGY. SAN NICOLAS":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN SEBASTIAN",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
      case "BFP BRGY. SAN SEBASTIAN":
        items = [
          "PNP BRGY. SAN ISIDRO",
          "PNP BRGY. MABINI",
          "PNP HILARIO STREET",
          "TALON GENERAL HOSPITAL",
          "CENTRAL LUZON DOCTORS HOSPITAL",
          "TARLAC PROVINCIAL HOSPITAL",
          "BFP BRGY. SAN ISIDRO",
          "BFP BRGY. SAN NICOLAS",
          "PNP BRGY. SAN MANUEL",
          "BFP BRGY. SAN MANUEL"
        ];
        break;
        case "BFP BRGY. SAN MANUEL":
        items = [
         
          "PNP BRGY. SAN MANUEL",
          "JECSONS HOSPITAL",
          "PDRRMO"
        ];
        break;
        case "PNP BRGY. SAN MANUEL":
        items = [
          "BFP BRGY. SAN MANUEL",
          "JECSONS HOSPITAL",
          "PDRRMO"
        ];
        break;
      case "JECSONS HOSPITAL":
        items = [
          "BFP BRGY. SAN MANUEL",
          "PNP BRGY. SAN MANUEL",

          "PDRRMO"
        ];
        break;
      default:
        items = [];
    }
    

    const mappedItems = items.map((name, index) => ({ id: index, label: name }));
    setTransferItems(mappedItems);
  };

  const onLoginPress = async () => {
    try {
      if (!uname) {
        console.error('Username is null or undefined');
        return;
      }

      const loginErr = validateLogin(uname, password);
      setLoginError(loginErr);

      if (loginErr) {
        return;
      }

      await AsyncStorage.setItem('username', uname);
      await AsyncStorage.setItem('station', uname);


      // ✅ Ensure transferItems is updated before navigation
      updateTransferItems(uname);
      
      console.log("Updated transferItems:", transferItems); // Debugging

      // First login request
      const response = await axios.get(
        'https://express-production-ac91.up.railway.app/serviceprovider/getServiceProvider',
        { params: { username: uname, password: password } }
      );

      if (response.data.success) {
        console.log('Login successful');
        const userId = response.data.userId;

        if (userId) {
          await AsyncStorage.setItem('service', uname);
          await AsyncStorage.setItem('usernameSP', uname);
          await AsyncStorage.setItem('userId', userId.toString());

          await imageChanger();

          // ✅ Ensure state is updated before navigating
          setTimeout(() => {
            navigation.navigate('SPMainPage' as never);
          }, 200);
        } else {
          console.error('User ID not found in response');
          setLoginError('User ID not found in response');
        }
      } else {
        console.log('Login failed:', response.data.message);
        setLoginError(response.data.message);
      }
    } catch (err) {
      handleAxiosError(err);
    }
  };
  

  
  
     
  const validateLogin = (username: string | null, password: string | null) => {
      if (!username || username.trim() === "") {
        return "Username cannot be empty.";
      }
    
      if (!password || password.trim() === "") {
        return "Password cannot be empty.";
      }
    
      return null; 
  };
    
    async function imageChanger() {
        try {
          const uname = await AsyncStorage.getItem('usernameSP');
          if (uname) {
            switch (uname) {
              case 'BFP BRGY. SAN ISIDRO':
                setMarkerUnameEmoji(require('../app/pictures/fire.png'));
                break;
              case 'BFP BRGY. SAN NICOLAS':
                setMarkerUnameEmoji(require('../app/pictures/fire.png'));
                break;
              case 'BFP BRGY. SAN SEBASTIAN':
                setMarkerUnameEmoji(require('../app/pictures/fire.png'));
                break;
              case 'PNP BRGY. SAN ISIDRO':
                setMarkerUnameEmoji(require('../app/pictures/police.webp'));
                break;
              case 'PNP BRGY. SAN MANUEL':
                setMarkerUnameEmoji(require('../app/pictures/fire.png'));
                break;
              case 'BFP BRGY. SAN MANUEL':
                setMarkerUnameEmoji(require('../app/pictures/police.webp'));
                break;
              case 'PNP BRGY MABINI':
                setMarkerUnameEmoji(require('../app/pictures/police.webp'));
                break;
              case 'PNP HILARIO STREET':
              setMarkerUnameEmoji(require('../app/pictures/police.webp'));
              break;
              case 'TARLAC PROVINCIAL HOSPITAL':
                setMarkerUnameEmoji(require('../app/pictures/medic.png'));
                break;
              case 'CENTRAL LUZON DOCTORS HOSPITAL':
                setMarkerUnameEmoji(require('../app/pictures/medic.png'));
                break;
              case 'TALON GENERAL HOSPITAL':
                setMarkerUnameEmoji(require('../app/pictures/medic.png'));
                break;
              case 'JECSONS HOSPITAL':
                setMarkerUnameEmoji(require('../app/pictures/medic.png'));
                break;
              case 'PDRRMO Station':
                setMarkerUnameEmoji(require('../app/pictures/ndrrmc.png'));
                break;
            }
          } else {
            console.log('No username found in AsyncStorage');
          }
        } catch (error) {
          console.error('Error fetching username from AsyncStorage:', error);
        }
      }

    function handleAxiosError (error: any): void  {
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
    

    return{
        onUnameChange,
        onPasswordChange,
        onLoginPress,
        markerEmoji,
        markerImageSize,
        loginError,
        markerUnameEmoji,
        imageChanger,
        uname,
        onProviderLoginPress,
        transferItems,
        transferableItems,
        updateTransferItems,
        serviceRequests
    }
}