import { useReducer, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InitialCitizen,reducerCitizen, validateLogin} from '@/app/types/user'
import {handleBirthdayChange} from '@/app/utils/validateUser'
import {getUser} from '@/app/services/userservice'
import  {validateName,validateBirthday,validatePassword, validateBarangayAndSitio,validateUsernamePhoto} from '@/app/utils/validateUser'
import {Action, Citizen} from '@/app/types/user'
import usePhoto from '@/hooks/usePhoto'
import handleAxiosError from '@/app/utils/handleAxiosError'

const useCheckPassword = () => {
  const {uploadProfile,setPassword,setrepassword} = usePhoto();

  const navigation = useNavigation();

  const[barangaySitioError, setbarangaySitioError] = useState<string | null>(null);
  const[barangay,setBarangay] = useState<string | null>(null);
  const [sitio,setSitio] =  useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>()
  const [providerPassword, setProviderPassword] = useState<string | null>()
  const [providerLoginError,setProviderLoginError] = useState<string | null>()
  const [passworderr,setpassworderr] = useState<string | null>()


  const [usernamePhotoError,setUsernamePhotoError] = useState<string | null>(null);


  // user
  const [state,dispatch] = useReducer(reducerCitizen, InitialCitizen);




  const handleChangeState = (key: string, value: string | number) => {
    dispatch({
      actionType: 'input',
      data: { [key]: value }, 
    });
  };
 

  

   // barangay and sitio

   const handleSitioChange = (text: any) => {
    setSitio(text)
    const validationError = validateBarangayAndSitio(barangay,text)
    setbarangaySitioError(validationError)
    console.log("Chosen sitio: " + sitio)
  }

  const handleBarangayChange = (text: any) => {
    setBarangay(text)
    const validationError = validateBarangayAndSitio(text, sitio)
    setbarangaySitioError(validationError)
    console.log("Chosen barangay: " + barangay)
  }

 


  const onBirthdayChange = (text: string) => {
    handleBirthdayChange(text, state.birthdate ? state.birthdate.toString() : null, dispatch);
  };
  

  const handleNextPressSignup = async () => {
    try {
      // Validate the user inputs
      const nameError = validateName(state.firstname ?? '', state.middlename ?? '', state.lastname ?? '');
      const birthdayError = validateBirthday(state.birthdate ? state.birthdate.toString() : '');
      const barangaySitioError = validateBarangayAndSitio(barangay, sitio);
  
      if (nameError || birthdayError || barangaySitioError) {
        dispatch({
          actionType: 'error',
          data: { error: nameError || birthdayError || barangaySitioError },
        });
        return;
      }
  
      dispatch({ actionType: 'input', data: { error: null } });
  
      
      await userSubmit(state, dispatch);
  
      const id = await AsyncStorage.getItem('firstId');
      const gender = await AsyncStorage.setItem('gender',state.gender!)

      if (barangay) {
        await AsyncStorage.setItem('address', barangay);
      } else {
        console.log('Barangay is null, not storing in AsyncStorage');
      }
      




      if (!id) {
        throw new Error('User ID not found in AsyncStorage');
      }

     
  
      console.log('Retrieved User ID:', id);
  
     
  
      navigation.navigate('UsernamePhoto' as never);
  
    } catch (error: any) {
      handleAxiosError(error);
    }
  };
  
  


  const handleConfirmUsernamePhoto = async () => {
    try {
      const usernamePhotoError = validateUsernamePhoto(state.username ?? '');
      
     await uploadProfile();

      

      if (usernamePhotoError) {
        dispatch({
          actionType: 'error',
          data: {
            error: usernamePhotoError,
          },
        });
        return; 
      }
  
      dispatch({
        actionType: 'input',
        data: {
          error: null,
        },
      });
  
      //await updateUser(state.username ?? 'Lebron James', dispatch);
  
      navigation.navigate('CitizenLogin' as never);
      
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const handleCitizenLogin = async () => {
  try {
      const validationError = validateLogin(state.username!, state.password!, state);

      console.log(state.username, state.password)
      if (validationError) {
          dispatch({
              actionType: 'error',
              data: {
                  error: validationError,
              },
          });
          return; 
      }

      dispatch({
          actionType: 'input',
          data: {
              error: null,
          },
      });

      let userLoginError = null; 

      await getUser(state.username ?? 'Lebron', state.password ?? 'Lebron', (action) => {
          dispatch(action);
          if (action.actionType === 'error') {
              userLoginError = action.data.error; 
          }
      });

      if (!userLoginError) {
          navigation.navigate('MainPage' as never); 
      } else {
          console.log('Login failed, will not navigate:', userLoginError);
      }
  } catch (error: any) {
      if (error.response && error.response.status === 401) {
          console.log('Server responded with 401:', error.response.data);
          dispatch({
              actionType: 'error',
              data: {
                  error: 'Username or Password is incorrect',
              },
          });
      } else {
          handleAxiosError(error);
      }
  }
};



const userSubmit = async (
  state: Citizen,
  dispatch: React.Dispatch<Action>
) => {
  try {
     const payload = {
      lname: state.lastname,
      fname: state.firstname,
      mname: state.middlename,
      gender: state.gender,
      birthday: state.birthdate?.toString(),
      address: barangay,
    };

    console.log('Payload being sent to backend:', payload);

    const userResponse = await axios.post(
      'https://express-production-ac91.up.railway.app/user/submittt',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    const { userId } = userResponse.data;


    if (userId) {
      await AsyncStorage.setItem('firstId', userId.toString());
      console.log('User ID saved to AsyncStorage:', userId);
    } else {
      throw new Error('User ID is missing from the backend response');
    }


    if (state.firstname) await AsyncStorage.setItem('fname', state.firstname);
    if (state.lastname) await AsyncStorage.setItem('lname', state.lastname);
    if (state.middlename) await AsyncStorage.setItem('mname', state.middlename);

    dispatch({
      actionType: 'post',
      data: {
        lastname: state.lastname,
        firstname: state.firstname,
        middlename: state.middlename,
        birthdate:  state.birthdate,
        gender: state.gender,
      },
    });

    console.log('User data saved:', userResponse.data);
  } catch (error) {
    handleAxiosError(error);

    // Dispatch an error action
    dispatch({
      actionType: 'error',
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
    });
  }
};

  return {
    handleNextPressSignup,
    sitio,
    barangay,
    handleBarangayChange, 
    handleSitioChange, 
    setBarangay, 
    setSitio,
    barangaySitioError,
    usernamePhotoError,
    handleConfirmUsernamePhoto,
    handleCitizenLogin,
    handleChangeState,
    state,
    onBirthdayChange,
    setProviderName,
    setProviderPassword,
    providerLoginError,
    passworderr,
  };
};

export default useCheckPassword;