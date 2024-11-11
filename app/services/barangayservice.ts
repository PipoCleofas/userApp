import {Action,Barangay} from '@/app/types/barangay'
import axios from 'axios';
import handleAxiosError from '@/app/utils/handleAxiosError'


export async function submitBarangay(
    state: Barangay, 
    dispatch: React.Dispatch<Action>) 
    {
        try{
            const barangayResponse = await axios.post('http://db-production-c620.up.railway.app/barangay/submit', {
                barangayname: state.BarangayName,
                sitio: state.Sitio
              }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              });
      
              console.log('Barangay data saved:', barangayResponse.data);
    
            dispatch({
                actionType: 'post',
                data: state
            })
        }catch(error){
           handleAxiosError(error);
        }
       

   
}