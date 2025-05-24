import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Modal, Pressable, TouchableOpacity, Image, TextInput, Button, ScrollView } from 'react-native';
import useLocation from '@/hooks/useLocation';
import useHandleClicks from '@/hooks/useHandleClicks';
import Notification from '@/components/notification-holder/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign,Feather, FontAwesome5 } from '@expo/vector-icons';
import useChat from '@/hooks/useChat';
import useEvidence from '@/hooks/useEvidence'

const markerImages = { 
  'PNP Station': require('./pictures/police.webp'),
  'BFP Station': require('./pictures/fire.png'),
  'Medical Station': require('./pictures/medic.png'),
  'PDRRMO Station': require('./pictures/ndrrmc.png'),
  'PNP BRGY. MABINI': require('./pictures/police.webp'),
  'PNP BRGY. SAN ISIDRO': require('./pictures/police.webp'),
  'PNP HILARIO STREET': require('./pictures/police.webp'),
  'BFP BRGY. SAN ISIDRO': require('./pictures/fire.png'),
  'BFP BRGY. SAN SEBASTIAN': require('./pictures/fire.png'),
  'BFP BRGY. SAN NICOLAS': require('./pictures/fire.png'),
  'CENTRAL LUZON DOCTORS HOSPITAL': require('./pictures/medic.png'),
  'TARLAC PROVINCIAL HOSPITAL': require('./pictures/medic.png'),
  'TALON GENERAL HOSPITAL': require('./pictures/medic.png'),
  'JECSONS HOSPITAL': require('./pictures/medic.png'),

  'PNP RIDER': require('./pictures/finalCop.png'),
  'Rider': require('./pictures/finalRescue.png'),
  'FIRE TRUCK': require('./pictures/finalFireTruck.png'),
  'Ambulance': require('./pictures/finalMedic.png'),
  'Male': require('./pictures/finalPerson.png'),
  'Female': require('./pictures/finalPerson.png'),
};

export default function MainPage() {
 
  const [gender, setGender] = useState<string | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [uname,setUname] = useState<string | null>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [isVisible, setIsVisible] = useState(false);

  const {
    pickImage,
    captureImage,
    pickVideo,
    recordVideo,
    startRecordingAudio,
    stopRecordingAudio,
    mediaUri,
    mediaType,
    isRecording,
    handleSubmit
  } = useEvidence();

  
  const handleServicePress = (service: string): void => {
    setSelectedServices((prev: string[]) => {
      if (prev.includes(service)) {
        // Remove the service if it's already selected
        return prev.filter(s => s !== service);
      }
      // Add the service if it's not already selected
      return [...prev, service];
    });
  };
  

  const isSelected = (service: string): boolean => selectedServices.includes(service);

  const openEvidenceModal = () => setIsVisible(true);
  const closeEvidenceModal = () => setIsVisible(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gender = await AsyncStorage.getItem('gender');
        const username = await AsyncStorage.getItem('username');
        console.log('Gender:', gender, 'Username:', username);
        setGender(gender ?? null); // Default to null if no value
        setUname(username ?? null);
      } catch (error) {
        console.error('Error fetching AsyncStorage data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const { sendMessageUser, messages, setMessageInput, messageInput } = useChat();
  const { location, errorMsg, isFetching } = useLocation();
  const { EmergencyAssistanceRequest, markerEmoji, markerImageSize, markers } = useHandleClicks();


  const [triggerNotification, setTriggerNotification] = useState(false);
  const [emergencyAssistanceModalVisible, setEmergencyAssistanceModalVisible] = useState(false);

  function serviceVisible() {
    if (!mediaUri) {
      setEmergencyAssistanceModalVisible((prev) => !prev);
    }
  }
  

useEffect(() => {
    const interval = setInterval(() => {
      console.log('Markers markers:', markers);
    }, 5000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [markers]);
  

  async function emerAssReq(
    selectedServices: string[],
    markerEmoji: any,
    imageWidth: number = 65,
    imageHeight: number = 60
  ): Promise<void> {
    for (const service of selectedServices) {
      await AsyncStorage.setItem('serviceChosen', service);
      EmergencyAssistanceRequest(service, markerEmoji, imageWidth, imageHeight, 'pending');
    }
    setSelectedServices([])
    setEmergencyAssistanceModalVisible(false);
    setTriggerNotification(true);
    setTimeout(() => setTriggerNotification(false), 2000);
  }
  


  const defaultRegion = {
    latitude: 15.4817,
    longitude: 120.5979,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const handleNextPartEAR = () => {
    handleSubmit()
    if(!mediaUri) return;
    console.log("Submit done")
    setIsVisible(false)
    setEmergencyAssistanceModalVisible(true)
    console.log("Visible done")

  }

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <>
        <Notification
          message={'Authorities are alerted'}
          trigger={triggerNotification}
        />

<Modal style={styles.modal} visible={isVisible}>
  <View style={styles.containerEvidence}>
    {/* Header */}
    <TouchableOpacity onPress={closeEvidenceModal} style={styles.header}>
      <Text style={styles.headerText}>Upload Evidence</Text>
      <FontAwesome5 name="chevron-down" size={16} color="white" />
    </TouchableOpacity>

    {/* Upload Options */}
    <View>
      {[
        { icon: "cloud-upload-alt", text: "Image", action: pickImage },
        { icon: "camera", text: "Capture", action: captureImage },
        { icon: "video", text: "Pick Video", action: pickVideo },
        { icon: "video", text: "Record", action: recordVideo },
        { icon: "microphone", text: "Audio", action: startRecordingAudio, color: isRecording ? "red" : "#999" },
        { icon: "stop-circle", text: "Stop", action: stopRecordingAudio }
      ].map(({ icon, text, action, color = "#999" }, index) => (
        <TouchableOpacity key={index} style={styles.uploadBox} onPress={action}>
          <FontAwesome5 name={icon} size={24} color={color} />
          <Text style={styles.uploadText}>{text}</Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Display selected file */}
    {mediaUri && <Text style={styles.uploadText}>Selected: {mediaType}</Text>}

    {/* Submit Button */}
    <TouchableOpacity style={styles.submitButton} onPress={handleNextPartEAR}>
      <Text style={styles.submitText}>Submit</Text>
    </TouchableOpacity>
  </View>
</Modal>




        {/* Modal */}
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

                <ScrollView 
                style={modalStyles.scrollView}
                ref={scrollViewRef}
                onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
                }
              >
                {messages.map((v) => (
                  <Text
                    key={v.id}
                    style={
                      v.sender === 'user'
                        ? modalStyles.spMessage
                        : modalStyles.userMessage
                    }
                  >
                    {v.message}
                  </Text>
                ))}
                </ScrollView>
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
                  onPress={() => sendMessageUser()}
                />
              </View>
            </View>
          </View>
        </Modal>
        
        <Modal
          animationType="fade"
          transparent={true}
          visible={emergencyAssistanceModalVisible}
          onRequestClose={() => setEmergencyAssistanceModalVisible(!emergencyAssistanceModalVisible)}>
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={{ marginBottom: 10,     fontFamily: "ReadexPro" }}>Choose Service</Text>
              <View style={modalStyles.buttonModal}>
                <View style={modalStyles.servicesContainerStyle}>
                <Pressable
                  style={[
                    modalStyles.serviceButton,
                    isSelected('BFP') && { backgroundColor: 'lightgreen' },
                  ]}
                  onPress={() => handleServicePress('BFP')}
                >
                  <Text style={modalStyles.textStyle}>BFP</Text>
                </Pressable>

                <Pressable
                  style={[
                    modalStyles.serviceButton,
                    isSelected('PNP') && { backgroundColor: 'lightgreen' },
                  ]}
                  onPress={() => handleServicePress('PNP')}
                >
                  <Text style={modalStyles.textStyle}>PNP</Text>
                </Pressable>
              </View>

              <View style={modalStyles.servicesContainerStyle}>
                <Pressable
                  style={[
                    modalStyles.serviceButton,
                    isSelected('Medical') && { backgroundColor: 'lightgreen' },
                  ]}
                  onPress={() => handleServicePress('Medical')}
                >
                  <Text style={modalStyles.textStyle}>Medical</Text>
                </Pressable>

                <Pressable
                  style={[
                    modalStyles.serviceButton,
                    isSelected('PDRRMO') && { backgroundColor: 'lightgreen' },
                  ]}
                  onPress={() => handleServicePress('PDRRMO')}
                >
                  <Text style={modalStyles.textStyle}>PDRRMO</Text>
                </Pressable>
                </View>
                <Pressable style={modalStyles.closeButton} onPress={() => emerAssReq(selectedServices, markerEmoji)}>
                  <Text style={modalStyles.textStyle}>Submit Request</Text>
                </Pressable>
                <Pressable style={modalStyles.closeButton} onPress={() => setEmergencyAssistanceModalVisible(false)}>
                  <Text style={modalStyles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {isFetching && <Text>Fetching location...</Text>}
        {errorMsg && <Text>{errorMsg}</Text>}
        {!isFetching && location && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={defaultRegion}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            >
              <Image
                source={markerEmoji}
                style={{ width: markerImageSize.width, height: markerImageSize.height }}
              />



            </Marker>
            {markers && markers.map((marker, index) => {
              const markerImage = markerImages[marker.title as keyof typeof markerImages] || markerImages['PDRRMO Station'];
              return (
                <Marker
                  key={index}
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  title={marker.title}
                  description={`Latitude: ${marker.latitude}, Longitude: ${marker.longitude}`}
                >
                  <Image source={markerImage} style={{ width: 40, height: 40 }} />
                </Marker>
              );
            })}
           
          </MapView>

          
        )}

        <View style={styles.tabBarContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={openEvidenceModal}>
                <Text style={styles.buttonText}>Emergency Request</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.messageIcon}
                onPress={() => setChatModalVisible(true)}
              >
                <AntDesign name="message1" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
    </View>
  );
}


const styles = StyleSheet.create({
  
  messageIcon: {
    position: 'absolute',
    bottom: 70, // Distance from the bottom
    left: 150, // Distance from the right side
    backgroundColor: '#4A90E2', // Blue background for better visibility
    borderRadius: 35, // Larger border radius for smoother circular shape
    width: 70, // Slightly bigger icon size
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // Elevated shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, // Softer shadow
    shadowRadius: 6,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  containerEvidence: {
    width: '75%', 
    maxHeight: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
    elevation: 5, // Adds a subtle shadow
  },
  header: {
    backgroundColor: '#870D26',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: "ReadexPro",
  },
  label: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: "ReadexPro",
  },
  uploadBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontFamily: "ReadexPro",
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#870D26',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: "ReadexPro",

  },
  
  messageIconPressed: {
    backgroundColor: '#3A70C2', // Slightly darker shade on press
  },
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
  buttonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    borderWidth: 2,         // Add a border to show when pressed
    borderColor: '#FFD700', // Gold color for the border
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
  
  dropdown: {
    marginTop: 8,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  
});

const modalStyles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    flexDirection: 'column',
  },
  servicesContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceButton: {
    width: 120,
    height: 60,
    backgroundColor: '#AD5765',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    backgroundColor: 'red',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "ReadexPro",
  },
  iconButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
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
    fontFamily: "ReadexPro",

  },
  headerStyle: {
    color: 'red',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 25,
    marginLeft: 5
  },
  message: {
    marginBottom: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
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
  reply: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  scrollView: {
    maxHeight: 200, // Adjust height as needed
  },
  
  messageContainer: {
    marginVertical: 10,
    width: '100%',
  },
});