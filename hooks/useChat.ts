import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://express-production-ac91.up.railway.app'; 

interface Message {
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
  const conversation_id = AsyncStorage.getItem('conversation_id');
  const userID = AsyncStorage.getItem('id');
  const spID = AsyncStorage.getItem('spID')

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Fetch existing conversation messages
    const fetchMessages = async () => {
      
      try {
        const response = await fetch(`${SOCKET_SERVER_URL}/conversations/${conversation_id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Listen for new incoming messages
    newSocket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [conversation_id]);

  const sendMessageUser = () => {
    if (socket && messageInput.trim()) {
      const newMessage = {
        senderId: userID,
        receiverId: spID, 
        message: messageInput,
        conversation_id,
      };
      socket.emit('sendMessage', newMessage);
      setMessageInput(''); 
    }
  };

  const sendMessageSP = () => {
    if (socket && messageInput.trim()) {
      const newMessage = {
        senderId: spID,
        receiverId: userID, 
        message: messageInput,
        conversation_id,
      };
      socket.emit('sendMessage', newMessage);
      setMessageInput(''); 
    }
  };

  return {
    messages,
    messageInput,
    setMessageInput,
    sendMessageUser,
    sendMessageSP
  };
};

export default useChat;
