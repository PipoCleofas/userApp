import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Modal, Pressable, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import useLocation from '@/hooks/useLocation';
import useHandleClicks from '@/hooks/useHandleClicks';
import Notification from '@/components/notification-holder/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign,Feather } from '@expo/vector-icons';
import useChat from '@/hooks/useChat';

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
  'PNP RIDER': require('./pictures/copCar.jpg'),
  'Rider': require('./pictures/rescueCar.jpg'),
  'FIRE TRUCK': require('./pictures/fireTruck.jpg'),
  'Ambulance': require('./pictures/ambulance.jpg'),
  'Male': require('./pictures/person.jpg'),
  'Female': require('./pictures/person.jpg'),
};

export default function MainPage() {

  const [gender, setGender] = useState<string | null>(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [uname,setUname] = useState<string | null>();

  

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
    setEmergencyAssistanceModalVisible((prev) => !prev);
  }

  async function emerAssReq(service: string, markerEmoji: any, imageWidth: number = 65, imageHeight: number = 60) {
    await AsyncStorage.setItem('serviceChosen', service);
    EmergencyAssistanceRequest(service, markerEmoji, imageWidth, imageHeight, 'approved');

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


  return (
    <View style={styles.container}>
      <>
        <Notification
          message={'Authorities are alerted'}
          trigger={triggerNotification}
        />

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
              <Text style={{ marginBottom: 10 }}>Choose Service</Text>
              <View style={modalStyles.buttonModal}>
                <View style={modalStyles.servicesContainerStyle}>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('BFP', markerImages['Male'])}>
                    <Text style={modalStyles.textStyle}>BFP</Text>
                  </Pressable>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('PNP', markerImages['Male'])}>
                    <Text style={modalStyles.textStyle}>PNP</Text>
                  </Pressable>
                </View>
                <View style={modalStyles.servicesContainerStyle}>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('Medical', markerImages['Male'])}>
                    <Text style={modalStyles.textStyle}>Medical</Text>
                  </Pressable>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('PDRRMO', markerImages['Male'])}>
                    <Text style={modalStyles.textStyle}>PDRRMO</Text>
                  </Pressable>
                </View>
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
              <TouchableOpacity style={styles.button} onPress={serviceVisible}>
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
  }
  
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
  },
  headerStyle: {
    color: 'red',
  },
  messageContainer: {
    marginBottom: 20,
    width: '100%',
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
});