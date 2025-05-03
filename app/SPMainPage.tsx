import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Pressable, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from 'expo-router';
import useHandleLogin from '@/hooks/handleSPLogin';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notification from '@/components/notification-holder/Notification';
import useChat from '@/hooks/useChat';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Linking } from "react-native";

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
  "BFP Assistance Request": require('../app/pictures/finalPerson.png'),
  "PNP Assistance Request": require('../app/pictures/finalPerson.png'),
  "Medical Assistance Request": require('../app/pictures/finalPerson.png'),
  "NDRRMC Assistance Request": require('../app/pictures/finalPerson.png'),
  "PDRRMO Assistance Request": require('../app/pictures/finalPerson.png'),
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
  const [checkEvidenceVisible,setCheckEvidenceVisible] = useState(false);

  const [serviceProvided, setServiceProvided] = useState<string | null>();
  const [nameInNeed, setNameInNeed] = useState<string | null>();
  const [message, setMessage] = useState<string | null>('');
  const [messageError, setMessageError] = useState<string | null>();
 
  const [showTransferModal,setShowTransferModal] = useState<boolean>(false)
  const [pendingRequests, setPendingRequests] = useState<any>()

  const { markerUnameEmoji, markerImageSize, imageChanger,transferItems, transferableItems, updateTransferItems } = useHandleLogin();
  const { sendMessageSP, messages, setMessageInput, setMessages, messageInput } = useChat();




  const defaultRegion = {
    latitude: 15.4817,
    longitude: 120.5979,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  
  useEffect(() => {
    let interval: NodeJS.Timeout; // Store interval ID

    const fetchPendingRequests = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        if (!username) return;

        const response = await axios.get(`https://express-production-ac91.up.railway.app/marker/getPending`, {
          params: { Station: username },
        });
        console.log(response.data)
        setPendingRequests(response.data);
      } catch (err) {
        console.error("Error fetching pending requests:", err);
      }
    };

    // Run immediately, then every 5 seconds
    fetchPendingRequests();
    interval = setInterval(fetchPendingRequests, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  async function handleSendMessage() {
    try {
      if (!serviceProvided || !nameInNeed || !message) {
        setMessageError('Fill up the requirements');
        return;
      }

      const d = new Date();
      console.log("Date: " + d)
      const finalMessage = `The Service Provided is ${serviceProvided}. The name of the person in need is ${nameInNeed}. ${d + ". " + message}`;
      await axios.post("https://express-production-ac91.up.railway.app/messaging/submit", {
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
  
    
    async function handleCheckEvidence(UserID: number) {
      if (!UserID) {
        console.error("❌ UserID is required.");
        return;
      }
    
      try {
        const response = await axios.get(
          `https://express-production-ac91.up.railway.app/photo/getMedia/${UserID}`
        );
    
        if (response.data.success && response.data.media.length > 0) {
          const mediaUrl = response.data.media[0].cloudinary_url; // Get the first media URL
    
          console.log("✅ Opening media:", mediaUrl);
          Linking.openURL(mediaUrl); // Open in the default web browser
        } else {
          console.log("⚠️ No media found:", response.data.message);
        }
      } catch (error:any) {
        console.error("❌ Error fetching media:", error.response?.data || error.message);
      }
    }

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
    
        console.log('SERVICE TYPE: ', servicetype);
    
        let markerResponseData = [];
    
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
    
        // Call getMarker endpoint
        const singleResponse = await axios.get(
          `https://express-production-ac91.up.railway.app/marker/getMarker/${encodeURIComponent(servicetype)}`
        );
    
        markerResponseData = [...markerResponseData, ...singleResponse.data];
    
        console.log('Got the markers from: ' + servicetype);
    
        if (Array.isArray(data)) {
          const updatedMarkers = [...data, ...markerResponseData];
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
  
        if (sender_id) {
          await AsyncStorage.setItem('senderID', sender_id.toString());
        } else {
          console.log('sender_id is null or undefined');
        }
  
        if (!conversation_id) {
          console.log('conversation_id is null or undefined');
          return;
        }
  
        const getConvo = await axios.get('https://express-production-ac91.up.railway.app/messaging/getLatestConvo', {
          params: { conversation_id },
        });
  
        if (!getConvo.data.success) {
          console.error('Failed to fetch conversation details:', getConvo.data.message);
          return;
        }
  
        const { messages } = getConvo.data; // Ensure we use `messages`, not `message`
  
        if (Array.isArray(messages)) {
          setMessages(messages);
        } else {
          console.error('No valid message data received:', messages);
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
  
  async function handleApprove(UserID: number) {
    const Status = "Approved"; // Set the new status
    
    const Station = await AsyncStorage.getItem('station')
    console.log("Station: sfaf ",Station)
    axios
      .put("https://express-production-ac91.up.railway.app/marker/updateStatusRequest", { Status, UserID, Station })
      .then((response) => {
        console.log("✅ Status updated:", response.data);
      })
      .catch((error) => {
        console.error("❌ Error updating status:", error.response?.data || error.message);
      });
  }

  async function handleReject(UserID: number) {
    const Status = "Rejected";
    const RequestStatus = "rejected";
  
    const Station = await AsyncStorage.getItem('station');
  
    axios
      .put("http://express-production-ac91.up.railway.app/marker/updateStatusRequest", {
        Status,
        UserID,
        Station
      })
      .then((response1) => {
        console.log("✅ Marker status updated:", response1.data);
  
        return axios.put("http://express-production-ac91.up.railway.app/updateRequestStatus", {
          UserID,
          RequestStatus,
        });
      })
      .then((response2) => {
        console.log("✅ Service request status updated:", response2.data);
      })
      .catch((error) => {
        console.error("❌ Error during rejection process:", error.response?.data || error.message);
      });
  }


  
  const handleTransferPress = async (transferTo: string) => {
    try {
      const uname = await AsyncStorage.getItem('username');
      if (!uname) {
        console.error("Username not found in AsyncStorage");
        return;
      }
      
      try {
        await axios.post(
          "https://express-production-ac91.up.railway.app/messaging/uploadLog",
          {
            message: `${uname} transferred to ${transferTo}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        console.log("Message uploaded successfully.");
      } catch (messageError) {
        console.error("Message upload failed:", messageError);
      }
      // Modify transferTo before proceeding
      let modifiedTransferTo = transferTo;
      switch (transferTo) {
        case 'PNP MABINI':
          modifiedTransferTo = 'pnpmabinimarker';
          break;
        case 'PNP HILARIO':
          modifiedTransferTo = 'pnphilariomarker';
          break;
        case 'PNP SAN ISIDRO':
          modifiedTransferTo = 'pnpsanisidromarker';
          break;
        case 'CLDH':
          modifiedTransferTo = 'centralmarker';
          break;
        case 'TPH':
          modifiedTransferTo = 'provincialmarker';
          break;
        case 'TALON':
          modifiedTransferTo = 'talonmarker';
          break;
        case 'BFP SAN NICOLAS':
          modifiedTransferTo = 'bfpsannicolasmarker';
          break;
        case 'BFP SAN SEBASTIAN':
          modifiedTransferTo = 'bfpsansebastianmarker';
          break;
        case 'BFP SAN ISIDRO':
          modifiedTransferTo = 'bfpsanisidromarker';
          break;
      }
  
      let curTable: string;
      switch (uname) {
        case 'BFP BRGY. SAN ISIDRO': curTable = 'bfpsanisidromarker'; break;
        case 'BFP BRGY. SAN NICOLAS': curTable = 'bfpsannicolasmarker'; break;
        case 'BFP BRGY. SAN SEBASTIAN': curTable = 'bfpsansebastianmarker'; break;
        case 'PNP BRGY. SAN ISIDRO': curTable = 'pnpsanisidromarker'; break;
        case 'PNP BRGY. MABINI': curTable = 'pnpmabinimarker'; break;
        case 'PNP BRGY. HILARIO': curTable = 'pnphilariomarker'; break;
        case 'TALON GENERAL HOSPITAL': curTable = 'talonmarker'; break;
        case 'CENTRAL LUZON DOCTORS HOSPITAL': curTable = 'centralmarker'; break;
        case 'TARLAC PROVINCIAL HOSPITAL': curTable = 'provincialmarker'; break;
        case 'PDRRMO Station': curTable = 'pdrrmomarker'; break;
        default: curTable = 'bfpsanisidromarker';
      }
  
      if (!modifiedTransferTo) {
        console.error("Transfer target table is missing");
        return;
      }
      
      let providerID;

      switch (transferTo) {
        case 'PNP MABINI':
          providerID = '10151';
          break;
        case 'PNP HILARIO':
          providerID = '10153';
          break;
        case 'PNP SAN ISIDRO':
          providerID = '10152';
          break;
        case 'CLDH':
          providerID = '10198';
          break;
        case 'TPH':
          providerID = '10187';
          break;
        case 'TALON':
          providerID = '10199';
          break;
        case 'BFP SAN NICOLAS':
          providerID = '10165';
          break;
        case 'BFP SAN SEBASTIAN':
          providerID = '10176';
          break;
        case 'BFP SAN ISIDRO':
          providerID = '10154';
          break;
      }

      await axios.put(
        `https://express-production-ac91.up.railway.app/messaging/updateReceiver/${providerID}`,
        {}, // No body needed
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      await axios.post(
        `https://express-production-ac91.up.railway.app/marker/transferMarker?table=${modifiedTransferTo}&currentTable=${curTable}`,
        {}, // No body needed
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setShowTransferModal(false); // Close modal after successful transfer
    } catch (err) {
      console.error("Transfer failed:", err);
    }
  };
  

  useEffect(() => {
    if (showTransferModal && uname) {
      updateTransferItems(uname); // ✅ Ensure state updates when modal opens
    }
  }, [showTransferModal, uname]);

  const handleShowTransferModalPress = () => {
    setShowTransferModal(true)
  }

  const handleBackPress = () => {
    setShowTransferModal(false)
  }

  

  return (
    <View style={styles.container}>

    <Modal visible={showTransferModal} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Header without dropdown */}
              <View style={styles.header}>
                <Text style={styles.headerText}>Transfer Request</Text>
                <TouchableOpacity onPress={() => handleBackPress()} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✖</Text>
                </TouchableOpacity>
              </View>

              

              {/* List of transfer requests */}
              <View style={styles.listContainer}>
                {transferItems.length === 0 ? (
                  <Text style={{    fontFamily: "ReadexPro"}}>No transfer items available</Text>
                ) : (
                  transferItems.map((item, index) => (
                    <View key={item.id} style={styles.requestRow}>
                      <View style={styles.labelBox}>
                        <Text style={styles.labelText}>{item.label}</Text>
                      </View>
                      <TouchableOpacity style={styles.selectButton} onPress={() => handleTransferPress(item.label)}>
                        <Text style={styles.buttonText}>SELECT</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleBackPress}>
                        <Text style={styles.buttonText}>CANCEL</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>

            </View>
          </View>
    </Modal>

    <Modal visible={checkEvidenceVisible} transparent animationType="fade">
  <View style={styles.modalWrapper}>
    <View style={styles.modalBox}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>View Request</Text>
        <TouchableOpacity onPress={() => setCheckEvidenceVisible(false)}>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Loop through pendingRequests */}
        {pendingRequests?.length > 0 ? (
          pendingRequests.map((request: any, index: any) => (
            <View key={index} style={styles.userRow}>
              {/* Name */}
              <Text style={styles.nameText}>
                {request.Firstname} {request.Lastname}
              </Text>

              {/* Icons */}
              <View style={styles.actionIconsContainer}>
              <TouchableOpacity onPress={() => handleApprove(request.UserID)}>
                <Text style={styles.modalIcon}>✅</Text>
              </TouchableOpacity>

                <TouchableOpacity onPress={() => handleReject(request.UserID)}>
                  <Text style={styles.modalIcon}>❌</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleCheckEvidence(request.UserID)}>
                  <Text style={styles.modalIcon}>🖼️</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleShowTransferModalPress()}>
                  <Ionicons name="share-social-outline" size={24} color="black" />
                </TouchableOpacity>

              </View>
            </View>
          ))
        ) : (
          <Text style={{fontFamily: "ReadexPro"}}>No pending requests</Text>
        )}
      </View>
    </View>
  </View>
</Modal>






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
                <Text
                  key={v.id}
                  style={
                    v.sender === 'user'
                      ? modalStyles.userMessage
                      : modalStyles.spMessage
                  }
                >
                  {v.message}
                </Text>
              ))}

              </View>
              <View style={modalStyles.inputContainer}>
              <TextInput
                style={modalStyles.input}
                placeholder="Write a message..."
                onChangeText={(text) => setMessageInput(text)}
                value={messageInput}
              />
              <TouchableOpacity style={modalStyles.sendButton} onPress={sendMessageSP}>
                <Text style={modalStyles.sendButtonText}>SEND</Text>
              </TouchableOpacity>
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
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.header}>Enter Details</Text>

            <Text style={modalStyles.label}>Name of the person in need</Text>
            <TextInput style={modalStyles.input} onChangeText={setNameInNeed} maxLength={30} />

            <Text style={modalStyles.label}>Service Provided</Text>
            <TextInput style={modalStyles.input} onChangeText={setServiceProvided} maxLength={10} />

            <Text style={modalStyles.label}>Message</Text>
            <TextInput 
              style={[modalStyles.input, modalStyles.textArea]} 
              onChangeText={setMessage} 
              multiline={true} 
              maxLength={100} 
            />

            {messageError && <Text style={modalStyles.errorText}>{messageError}</Text>}

            <View style={modalStyles.buttonContainer}>
              <Pressable style={[modalStyles.button, modalStyles.sendButton]} onPress={handleSendMessage}>
                <Text style={modalStyles.buttonText}>Send</Text>
              </Pressable>
              <Pressable style={[modalStyles.button, modalStyles.closeButton]} onPress={() => setModalVisible(false)}>
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
      {/* Message Icon on the Left */}
      <TouchableOpacity onPress={() => setChatModalVisible(true)} style={styles.iconButton}>
        <AntDesign name="message1" size={30} color="black" />
      </TouchableOpacity>

      {/* Send Updates in the Center */}
      <TouchableOpacity
        style={[styles.button, isPressed ? styles.buttonPressed : null]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Send Updates</Text>
      </TouchableOpacity>

      {/* Notification Icon on the Right */}
      <TouchableOpacity onPress={() => setCheckEvidenceVisible(true)} style={styles.notificationButton}>
        <Ionicons name="notifications" size={24} color="red" />
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Ensures even spacing
    marginTop: 8,
    width: '100%', // Takes full width to distribute items
  },
  
  notificationButton: {
    marginLeft: 10, // Creates spacing from "Send Updates"
    padding: 10, // Ensures tapability
  },
  
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  notificationContainer: {
    position: 'absolute',
    top: -30, // Moves the notification icon above the Send Updates button
    alignSelf: 'center', // Centers it above the button
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "red", // Red background for the header
    padding: 10,
    borderRadius: 5,
    fontFamily: "ReadexPro",

  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // White text for contrast
    fontFamily: "ReadexPro",

  },
  dropdownArrow: {
    fontSize: 20,
    color: "white", // White dropdown arrow for contrast
  },
  content: {
    width: "100%",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "ReadexPro",

  },
  actionIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalIcon: {
    fontSize: 20,
  },
  
  header: {
    backgroundColor: "#870D29",
    padding: 12,
    flexDirection: "row",  // Align items in a row
    alignItems: "center",
    justifyContent: "space-between", // Push X to the right
    fontFamily: "ReadexPro",

  },
  
  closeButton: {
    padding: 10,
    position: "absolute",
    right: 10,  // Align to the right
    top: 5,

  },
  

  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "ReadexPro",

  },
  
  map: {
    width: '100%',
    height: '80%', 
  },
 
  
  iconButton: {
    padding: 10, // Adds spacing for touch area
  },
  
  transferImage: {
    width: 50, 
    height: 50, 
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
    fontFamily: "ReadexPro",

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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
 
  headerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "ReadexPro",

  },
  listContainer: {
    padding: 10,
  },
  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  labelBox: {
    backgroundColor: "#d3d3d3",
    padding: 8,
    flex: 1,
    marginRight: 5,
  },
  labelText: {
    fontWeight: "bold",
    fontFamily: "ReadexPro",

  },
  selectButton: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "darkred",
    padding: 8,
    borderRadius: 5,
  },
  
  
});

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  
  spMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#870D29',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
    fontFamily: "ReadexPro",

  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top', // Ensures text starts at the top for multiline input
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#007AFF', // iOS-style blue send button
  },
  closeButton: {
    backgroundColor: '#FF3B30', // iOS-style red close button
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "ReadexPro",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginTop: 10,
  },
  
  
  
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "ReadexPro",
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
  
  sender: {
    fontWeight: 'bold',
    marginBottom: 25,
    marginLeft: 5,
    fontFamily: "ReadexPro",

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
  
  headerStyle: {
    color: 'red',
  },
});