import handleAxiosError from '@/app/utils/handleAxiosError'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {ActionServiceRequest, ServiceRequestState} from '@/app/types/servicerequest'

export const serviceRequestSubmit = async(
    state: ServiceRequestState,
    dispatch: React.Dispatch<ActionServiceRequest>
) => {


    const address = await AsyncStorage.getItem('address');
    const USERID = await AsyncStorage.getItem('id');

    try{
    const serviceRequestResponse = await axios.post('https://fearless-growth-production.up.railway.app/servicerequest/submit', {
        UserID: USERID,
        requesttype: state.requestType,  
        requeststatus: state.requestStatus,  
        address: address                  
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Service request success');
      console.log('Request type set to: ' + state.requestType);

      dispatch({
        actionType: 'post',
        data: {
          requestType: state.requestType,
          requestStatus: state.requestStatus,
          UserID: parseInt(USERID ?? '1123'),
          error: null

        },
      });
      
    

    } catch (error: any) {
      handleAxiosError(error);

     
    }



}