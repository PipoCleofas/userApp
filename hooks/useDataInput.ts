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

const useCheckPassword = () => {
  const {uploadProfile} = usePhoto();

  const navigation = useNavigation();

  const[barangaySitioError, setbarangaySitioError] = useState<string | null>(null);
  const[barangay,setBarangay] = useState<string | null>(null);
  const [sitio,setSitio] =  useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>()
  const [providerPassword, setProviderPassword] = useState<string | null>()
  const [providerLoginError,setProviderLoginError] = useState<string | null>()



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
  

  const handleNextPress = async () => {
    try {
      // Validate the user inputs
      const nameError = validateName(state.firstname ?? '', state.middlename ?? '', state.lastname ?? '');
      const passwordError = validatePassword(state.password, state.repassword);
      const birthdayError = validateBirthday(state.birthdate ? state.birthdate.toString() : '');
      const barangaySitioError = validateBarangayAndSitio(barangay, sitio);
  
      if (nameError || passwordError || birthdayError || barangaySitioError) {
        dispatch({
          actionType: 'error',
          data: { error: nameError || passwordError || birthdayError || barangaySitioError },
        });
        return;
      }
  
      dispatch({ actionType: 'input', data: { error: null } });
  
    
      await userSubmit(state, dispatch);
  
      const id = await AsyncStorage.getItem('firstId');

      console.log(barangay)

      if (barangay) {
        await AsyncStorage.setItem('address', barangay);
      } else {
        console.log('Barangay is null, not storing in AsyncStorage');
      }
      




      if (!id) {
        throw new Error('User ID not found in AsyncStorage');
      }

     
  
      console.log('Retrieved User ID:', id);
  
     
  
      navigation.navigate('CitizenPhoto' as never);
  
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

const userSubmit = async (
  state: Citizen,
  dispatch: React.Dispatch<Action>
) => {
  try {
    const userResponse = await axios.post(
      'https://fearless-growth-production.up.railway.app/user/submit',
      {
        lname: state.lastname,
        fname: state.firstname,
        mname: state.middlename,
        password: state.password,
        repassword: state.repassword,
        birthday: state.birthdate?.toString(),
        address: barangay
      },
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
        password: state.password,
        repassword: state.repassword
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
    handleNextPress,
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
  };
};

export default useCheckPassword;