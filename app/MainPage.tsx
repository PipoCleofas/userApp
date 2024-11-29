import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Modal, Pressable, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import useLocation from '@/hooks/useLocation';
import useHandleClicks from '@/hooks/useHandleClicks';
import { useNavigation } from 'expo-router';
import Notification from '@/components/notification-holder/Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


};

export default function MainPage() {
  const { location, errorMsg, isFetching, handleArrivalTime, arrivalTime } = useLocation();
  const { EmergencyAssistanceRequest, markerEmoji, markerImageSize, markers } = useHandleClicks();

  const [triggerNotification, setTriggerNotification] = useState(false);
  const [emergencyAssistanceModalVisible, setEmergencyAssistanceModalVisible] = useState(false);

  function serviceVisible() {
    setEmergencyAssistanceModalVisible(!emergencyAssistanceModalVisible);
  }

  async function emerAssReq(service: string, markerEmoji: any, imageWidth: number = 65, imageHeight: number = 60) {
    await AsyncStorage.setItem('serviceChosen', service);
    EmergencyAssistanceRequest(service, markerEmoji, imageWidth, imageHeight, 'approved');
    setEmergencyAssistanceModalVisible(!emergencyAssistanceModalVisible);
    setTriggerNotification(true);
    setTimeout(() => setTriggerNotification(false), 2000);
  }


  async function cancelService() {
    let serviceChosen = await AsyncStorage.getItem('serviceChosen');
    console.log(serviceChosen)
    EmergencyAssistanceRequest('Canceled Service', null, markerImageSize.width, markerImageSize.height, 'Cancelled Service', serviceChosen!);
    setEmergencyAssistanceModalVisible(!emergencyAssistanceModalVisible);
  }

  const defaultRegion = {
    latitude: 15.4817,
    longitude: 120.5979,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (degrees: any) => degrees * (Math.PI / 180);
    const R = 6371e3;
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c / 1000;
  };

  useEffect(() => {
    if (location) {
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        15.4690,
        120.6045
      );
      console.log("Calculated distance:", distance);
      handleArrivalTime(distance);
    }
  }, [location?.coords.latitude, location?.coords.longitude]);

  return (
    <View style={styles.container}>
      <>
        <Notification
          message={'Authorities are alerted'}
          trigger={triggerNotification}
        />

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
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('BFP', markerImages['BFP Station'])}>
                    <Text style={modalStyles.textStyle}>BFP</Text>
                  </Pressable>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('PNP', markerImages['PNP Station'])}>
                    <Text style={modalStyles.textStyle}>PNP</Text>
                  </Pressable>
                </View>
                <View style={modalStyles.servicesContainerStyle}>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('Medical', markerImages['Medical Station'])}>
                    <Text style={modalStyles.textStyle}>Medical</Text>
                  </Pressable>
                  <Pressable style={modalStyles.serviceButton} onPress={() => emerAssReq('PDRRMO', markerImages['PDRRMO Station'])}>
                    <Text style={modalStyles.textStyle}>PDRRMO</Text>
                  </Pressable>
                </View>
                <Pressable style={modalStyles.closeButton} onPress={() => cancelService()}>
                  <Text style={modalStyles.textStyle}>Cancel Service</Text>
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
              <TouchableOpacity style={styles.button} onPress={serviceVisible}>
                <Text style={styles.buttonText}>Emergency Assistance</Text>
                <Text style={styles.buttonText}>Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
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
});