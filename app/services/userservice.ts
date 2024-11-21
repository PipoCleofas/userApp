import handleAxiosError from '@/app/utils/handleAxiosError'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Action, Citizen} from '@/app/types/user'

  
  export const updateUser = async (
    username: string,
  ) => {
    try {
      console.log("updating username")
      const fn = (await AsyncStorage.getItem('fname')) ?? null; 
      const ln = (await AsyncStorage.getItem('lname')) ?? null; 
      const mn = (await AsyncStorage.getItem('mname')) ?? null; 
  
      const response = await axios.put(`https://fearless-growth-production.up.railway.app/user/updateUser/${username}`, {
        fname: fn,
        lname: ln,
        mname: mn,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      
  
      console.log('Username updated successfully');
    } catch (error) {
      handleAxiosError(error);
  
    }
  };
  
  export const getUser = async (
    username: string,
    password: string,
    dispatch: React.Dispatch<Action>
  ) => {
    try {
      const response = await axios.get(`https://fearless-growth-production.up.railway.app/user/getUser`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          username,
          password,
        },
      });
  
      const user = response.data;
  
      if (user) {
        const { id, address, username: storedUsername } = user;
  
        if (id) {
          await AsyncStorage.setItem('id', id.toString());
          console.log('User ID stored in AsyncStorage');
        } else {
          dispatch({
            actionType: 'error',
            data: { error: 'User ID not found' },
          });
        }
  
        if (address) {
          await AsyncStorage.setItem('address', address);
          console.log('Address stored in AsyncStorage' + address);
        } else {
          dispatch({
            actionType: 'error',
            data: { error: 'Address not found' },
          });
        }
  
        if (storedUsername) {
          await AsyncStorage.setItem('username', storedUsername); 

          dispatch({
            actionType: 'get',
            data: { username: storedUsername },
          });
        }
      } else {
        dispatch({
          actionType: 'error',
          data: { error: 'User data not found' },
        });
      }
    } catch (error: any) {
      console.log('Error fetching user:', error.message);  // Logs detailed error message
      dispatch({
        actionType: 'error',
        data: { error: 'Invalid username or password' },
      });
    }
  };
  
  


  