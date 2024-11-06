import { useState } from "react";
import axios from "axios";
import { handleAxiosError } from "../../utils/handleAxiosError";
import { Client } from '../types/ClientList';
import { Request } from '../types/Request';
import { Messages } from '../types/Message';

export function useGetItems() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [markerIds, setMarkerIDs] = useState<number[] | undefined>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<Messages[] | null>(null); // Define messages consistently as Messages[] or null
  const [error, setError] = useState<string | null>(null);

  const checkAccounts = async (target: string, username?: string, password?: string): Promise<boolean> => {
    try {
      switch (target) {
        case 'admin': {
          const adminResponse = await axios.get(`http://192.168.100.127:3000/admin/getAdmin`, {
            headers: { 'Content-Type': 'application/json' },
            params: { username, password },
          });

          if (adminResponse.status === 200) {
            console.log('Admin authenticated:', adminResponse.data);
            return true;
          } else {
            setError('Invalid username or password');
            return false;
          }
        }
        case 'clients': {
          const clientResponse = await axios.get<Client[]>('http://192.168.100.127:3000/user/getUserList');
          setClients(clientResponse.data);
          console.log('Client IDs:', clientResponse.data.map(client => client.UserID));
          setError(null);
          return true;
        }
        case 'messages': {
          const messagesResponse = await axios.get<Messages[]>('http://192.168.100.127:3000/messaging/getMessage');
          setMessages(messagesResponse.data);  
          console.log('Messages:', messagesResponse.data);
          setError(null);
          return true;
        }
        default:
          setError('Invalid target.');
          return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        const message = handleAxiosError(error);
        setError(message || 'An error occurred while fetching data.');
      }
      return false;
    }
  };

  return {
    error,
    requests,
    clients,
    checkAccounts,
    markerIds,
    messages,
  };
}
