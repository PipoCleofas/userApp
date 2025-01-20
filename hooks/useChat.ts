import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://express-production-ac91.up.railway.app/messaging';

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  conversationId?: string;
}

const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [spId, setSpId] = useState<string | null>(null);

  // Fetch AsyncStorage values on mount
  /*
  useEffect(() => {
    const fetchAsyncStorageValues = async () => {
      const convoId = await AsyncStorage.getItem('conversation_id');
      const userID = await AsyncStorage.getItem('id');
      const serviceProviderID = await AsyncStorage.getItem('spID');
      setConversationId(convoId);
      setUserId(userID);
      setSpId(serviceProviderID);
    };

    fetchAsyncStorageValues();
  }, []);
  */

  /*
  // Initialize socket connection
  useEffect(() => {
    if (!conversationId) {
      console.log("Waiting for conversationId...");
      return; // Wait for conversationId to be set
    }

    // Delay the execution by 5 seconds
    const timeoutId = setTimeout(() => {
      console.log("Conversation id exists, now running useEffect");

      // Initialize socket connection
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      const fetchMessages = async () => { 
        try {
          const response = await fetch(`${SOCKET_SERVER_URL}/conversations/${conversationId}`);
          const text = await response.text(); 
          console.log('Server Response:', text);
          const data = JSON.parse(text); 
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();

      // Listen for new incoming messages
      newSocket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
        clearTimeout(timeoutId); 
      };
    }, 5000); 

    return () => {
      clearTimeout(timeoutId); 
    };
  }, [conversationId]);
  */
  
  // Send message from User
  const sendMessageUser = async () => {
    try {
      setMessageInput('')

      if (!messageInput?.trim()) {
        console.log("Message Input is null")
        return;
      }

      const userID = await AsyncStorage.getItem('id');
      const serviceProviderID = await AsyncStorage.getItem('spID');

      // Define the payload
      const payload = {
        sender_id: userID,
        receiver_id: serviceProviderID,
        message: messageInput,
      };
      const response = await axios.post(`${SOCKET_SERVER_URL}/submitConvo`, payload);
      




      console.log("Now fetching the conversation")

      const { conversation_id } = response.data;

      const responseConvo = await fetch(`${SOCKET_SERVER_URL}/conversations/${conversation_id}`);
      const text = await responseConvo.text(); 
      console.log("Success fetching the conversation")
      const data = JSON.parse(text); 
      console.log("Data: " + data)
      setMessages(data);


      // Handle the response
      console.log('Message sent successfully:', response.data);
  
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error sending message:', err.message);
        return {
          success: false,
          error: err.response?.data || 'An error occurred',
        };
      }
  
      // Fallback for non-Axios errors
      console.error('Unexpected error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  const sendMessageSP = async () => {
    const userID = AsyncStorage.getItem('userId')
    try {
      setMessageInput('')

      if (!messageInput?.trim()) {
        console.log("Message Input is null")
        return;
      }

      const sender_id = await AsyncStorage.getItem('senderID')
      
      const payload = {
        sender_id: userID,
        receiver_id: sender_id,
        message: messageInput,
      };

      const response = await axios.post(`${SOCKET_SERVER_URL}/submitConvoSP`, payload);
      console.log(2)
      console.log('Message sent successfully:', response.data);
  
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error sending message:', err.message);
        return {
          success: false,
          error: err.response?.data || 'An error occurred',
        };
      }
  
      // Fallback for non-Axios errors
      console.error('Unexpected error:', err);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    sendMessageUser,
    sendMessageSP,
    setMessages
  };
};

export default useChat;
