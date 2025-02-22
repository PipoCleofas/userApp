import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Pressable, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import useHandleLogin from '@/hooks/handleSPLogin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from '@/components/notification-holder/Notification';
import useChat from '@/hooks/useChat';
import { AntDesign, Feather } from '@expo/vector-icons';

interface MarkerType {
  latitude: number;
  longitude: number;
  title: string;
}

const markerImages: { [key: string]: any } = {
  "BFP BRGY. SAN ISIDRO": require('../app/pictures/fire.png'),
  "BFP BRGY. SAN NICOLAS": require('../app/pictures/fire.png'),
  "BFP BRGY. SAN SEBASTIAN": require('../app/pictures/fire.png'),
  "PNP BRGY. SAN ISIDRO": require('../app/pictures/police.webp'),
  "PNP BRGY. MABINI": require('../app/pictures/police.webp'),
  "PNP HILARIO STREET": require('../app/pictures/police.webp'),
  "TARLAC PROVINCIAL HOSPITAL": require('../app/pictures/medic.png'),
  "CENTRAL LUZON DOCTORS HOSPITAL": require('../app/pictures/medic.png'),
  "TALON GENERAL HOSPITAL": require('../app/pictures/medic.png'),
  "PDRRMO Station": require('../app/pictures/ndrrmc.png'),
  "BFP Assistance Request": require('../app/pictures/person.jpg'),
  "PNP Assistance Request": require('../app/pictures/person.jpg'),
  "Medical Assistance Request": require('../app/pictures/person.jpg'),
  "NDRRMC Assistance Request": require('../app/pictures/person.jpg'),
  "PDRRMO Assistance Request": require('../app/pictures/person.jpg'),
  'Male': require('./pictures/male.jpg'),
  'Female': require('./pictures/female.jpg'),
};
 
const getMarkerImage = (title: string) => {
  return markerImages[title]; // Fallback to default
};

export default function MainPage() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [uname,setUname] = useState<string | null>();

  const [triggerNotification, setTriggerNotification] = useState(false);


  const [serviceProvided, setServiceProvided] = useState<string | null>();
  const [nameInNeed, setNameInNeed] = useState<string | null>();
  const [message, setMessage] = useState<string | null>('');
  const [messageError, setMessageError] = useState<string | null>();

  const [conversationId, setConversationId] = useState<number | null>();
  const [receiverId, setReceiverID] = useState<number | null>();

  const { markerUnameEmoji, markerImageSize, imageChanger } = useHandleLogin();
  const { sendMessageSP, messages, setMessageInput, setMessages, messageInput } = useChat();

  const defaultRegion = {
    latitude: 15.4817,
    longitude: 120.5979,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  
  
  async function handleSendMessage() {
    try {
      if (!serviceProvided || !nameInNeed || !message) {
        setMessageError('Fill up the requirements');
        return;
      }

      const d = new Date();
      console.log("Date: " + d)
      const finalMessage = `The Service Provided is ${serviceProvided}. The name of the person in need is ${nameInNeed}. ${d + ". " + message}`;
      await axios.post("https://fearless-growth-production.up.railway.app/messaging/submit", {
        message: finalMessage
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setModalVisible(false);
      setMessageError(null);
    } catch (err: any) {
      console.error('Error sending message:', err.message);
    }
  }

  const isMarkerType = (obj: any): obj is MarkerType =>
    obj &&
    typeof obj.latitude === 'number' &&
    typeof obj.longitude === 'number' &&
    typeof obj.title === 'string';
  
    

    const fetchAndUpdateMarker = async () => {
      try {
        const username = await AsyncStorage.getItem('usernameSP');
        const response = await fetch(
          `https://express-production-ac91.up.railway.app/marker/getStation/${username}`
        );
    
        const data = await response.json();
    
        // Get service type from AsyncStorage
        const servicetype = await AsyncStorage.getItem('service');
        if (!servicetype) {
          throw new Error('Service type not found in AsyncStorage');
        }
    
        // Determine which endpoint to call based on username
        let markerResponseData = [];
        const specialUsernames = [
          'TALON GENERAL HOSPITAL',
          'BFP BRGY. SAN ISIDRO',
          'PNP BRGY. SAN ISIDRO',
          'PDRRMO STATION',
        ];
    
        if (specialUsernames.includes(username || '')) {
          // Fetch male and female requests concurrently
          const [maleResponse, femaleResponse] = await Promise.all([
            axios.get(
              `https://express-production-ac91.up.railway.app/marker/stationRequestsMale/${servicetype}`
            ),
            axios.get(
              `https://express-production-ac91.up.railway.app/marker/stationRequestsFemale/${servicetype}`
            ),
          ]);
    
          // Combine the data from both responses
          markerResponseData = [...maleResponse.data, ...femaleResponse.data];
        } else {
          // Call getMarker endpoint
          const singleResponse = await axios.get(
            `https://express-production-ac91.up.railway.app/marker/getMarker/${encodeURIComponent(servicetype)}`
          );
    
          markerResponseData = singleResponse.data;
        }
    
        console.log('Got the markers from: ' + servicetype);
    
        if (Array.isArray(data)) {
          const updatedMarkers = [...data, ...markerResponseData];
          console.log('Updated markers: ', updatedMarkers);
          setMarkers(updatedMarkers);
    
          // SP marker
          const userMarker = updatedMarkers.find(
            (marker: any) => marker.title === username
          );
    
          if (userMarker) {
            setCurrentLocation({
              latitude: userMarker.latitude,
              longitude: userMarker.longitude,
            });
          }
    
          // Check for Assistance Request
          const hasAssistanceRequest = updatedMarkers.some(marker =>
            marker.title?.includes('Assistance Request')
          );
    
          // Trigger notification if Assistance Request is found
          setTriggerNotification(hasAssistanceRequest);
        }
      } catch (error: any) {
        console.error('Unexpected error in fetchAndUpdateMarker:', error.message);
      }
    };
    
    
  
  
  
  

  
  
    
    
    useEffect(() => {
      const initialize = async () => {
          const username = await AsyncStorage.getItem("usernameSP");
          setUname(username);
          imageChanger(); 
      };
  
      initialize(); // Call the async function
  
      const intervalId = setInterval(fetchAndUpdateMarker, 3000);
  
      return () => clearInterval(intervalId);
  }, [markers]);
  
  useEffect(() => {
    const initialize = async () => {
        const username = await AsyncStorage.getItem("usernameSP");
        setUname(username);
        imageChanger(); 
    };

    initialize(); // Call the async function

    const intervalId = setInterval(fetchAndUpdateMarker, 3000);

    return () => clearInterval(intervalId);
}, [markers]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchLatestMessages = async () => {
      try {
        const userID = await AsyncStorage.getItem('userId');
        if (!userID) {
          console.error('User ID not found in AsyncStorage');
          return;
        }

        const responseConvo = await axios.get('https://express-production-ac91.up.railway.app/messaging/getLatestConversation', {
          params: { receiver_id: userID },
        });

        if (!responseConvo.data.success) {
          console.error('Failed to fetch latest conversation:', responseConvo.data.message);
          return;
        }

        const { sender_id, conversation_id } = responseConvo.data;
        await AsyncStorage.setItem('senderID', sender_id.toString());

        const getConvo = await axios.get('https://express-production-ac91.up.railway.app/messaging/getLatestConvo', {
          params: { conversation_id },
        });

        if (!getConvo.data.success) {
          console.error('Failed to fetch conversation details:', getConvo.data.message);
          return;
        }

        const { message } = getConvo.data;

        if (Array.isArray(message)) {
          setMessages(message);
          console.log('Messages updated:', message);
        } else if (message) {
          setMessages([message]); // Wrap a single message in an array
          console.log('Single message received:', message);
        } else {
          console.error('No valid message data received:', message);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const initializeFetching = async () => {
      await fetchLatestMessages(); // Initial fetch
      interval = setInterval(fetchLatestMessages, 3000); // Fetch every 3 seconds
    };

    initializeFetching();

    return () => clearInterval(interval);
  }, []);




  

  return (
    <View style={styles.container}>

        <Modal
          animationType="fade"
          transparent={true}
          visible={chatModalVisible}
          onRequestClose={() => setChatModalVisible(false)}
        >
          <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.modalContent}>
              <Feather name='x-circle' size={20} onPress={() => setChatModalVisible(false)} style={{left: 110}}/>
              <View>
                <Text style={modalStyles.header}>CHAT WITH US</Text>
              </View>
              <View style={modalStyles.messageContainer}>
                <Text style={modalStyles.sender} >{uname}</Text>

                {messages.map((v) => (
                    <Text style={modalStyles.message} key={v.id}>{v.message}</Text>
                ))}
              </View>
              <View style={modalStyles.inputContainer}>
                <TextInput
                  style={modalStyles.input}
                  placeholder="Write a message..."
                  onChangeText={(text) => setMessageInput(text)}
                  value={messageInput}
                />
                <Button
                  title="Send"
                  onPress={() => sendMessageSP()}
                />
              </View>
            </View>
          </View>
        </Modal>

      <Notification
          message={'Someone asked for help!'}
          trigger={triggerNotification}
        />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.label}>Name of the person in need</Text>
            <TextInput style={modalStyles.input} onChangeText={setNameInNeed} maxLength={30} />
            <Text style={modalStyles.label}>Service Provided</Text>
            <TextInput style={modalStyles.input} onChangeText={setServiceProvided} maxLength={10} />
            <Text style={modalStyles.label}>Message</Text>
            <TextInput style={[modalStyles.input, modalStyles.textArea]} onChangeText={setMessage} multiline={true} maxLength={100} />
            {messageError && <Text style={modalStyles.errorText}>{messageError}</Text>}
            <View style={modalStyles.buttonContainer}>
              <Pressable style={modalStyles.button} onPress={handleSendMessage}>
                <Text style={modalStyles.buttonText}>Send</Text>
              </Pressable>
              <Pressable style={modalStyles.button} onPress={() => setModalVisible(false)}>
                <Text style={modalStyles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={defaultRegion}
          
        >
          
          {markers.map((marker, index) => (
            marker.latitude && marker.longitude ? (
              <Marker
                key={index}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title || "No Title"}
                description={`Latitude: ${marker.latitude}, Longitude: ${marker.longitude}`}
              >
                <Image source={getMarkerImage(marker.title)} style={{ width: 45, height: 45 }} />
              </Marker>
            ) : null
          ))}
        </MapView>

      <View style={styles.tabBarContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, isPressed ? styles.buttonPressed : null]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Send Updates</Text>

              <AntDesign name="message1" size={30} color="black" style={{left: 95}} onPress={() => setChatModalVisible(true)}/>

            </TouchableOpacity>


          </View>
        </View>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '80%', 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarContainer: {
    width: '100%',
    height: '20%', 
    backgroundColor: 'white',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, 
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    borderWidth: 2,         
    borderColor: '#FFD700', 
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    backgroundColor: '#FFFDD0',
    padding: 5,
    width: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    color: 'black',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#AD5765',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    shadowColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
   modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonbar: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    marginTop: 5,
    backgroundColor: '#1E90FF',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    
    color: 'white',
  },
  buttonModal: {
    flexDirection: 'column',
  },
  servicesContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top', // For multiline input
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  messageContainer: {
    marginBottom: 20,
    width: '100%',
  },
  message: {
    marginBottom: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 25,
    marginLeft: 5
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  headerStyle: {
    color: 'red',
  },
});