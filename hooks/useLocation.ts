import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<number | string | null>(null);

  const fetchLocation = async () => {
    setIsFetching(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsFetching(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setTitle("Emergency Assistance Request");
      setDescription("Emergency Assistance Request");

    } catch (error) {
      setErrorMsg("Can't get location");
    } finally {
      setIsFetching(false);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const id = await AsyncStorage.getItem('id');
        const station = await AsyncStorage.getItem('serviceChosen');
  
        if (!id || latitude === null || longitude === null) {
          console.log('Missing required data: ', { id, latitude, longitude });
          return;
        }
  
        const payload = {
          Stations: station ? [station] : null,
          latitude,
          longitude,
          UserID: id,
        };
  
        console.log('Sending payload:', payload);
  
        await axios.post(
          'https://express-production-ac91.up.railway.app/marker/updatePosition',
          payload
        );
  
      } catch (err: any) {
        console.log('Failed to update coordinates:', err.response?.data || err.message);
      }
    }, 3000);
  
    return () => clearInterval(interval);
  }, [latitude, longitude]);
  
  
  useEffect(() => {
    fetchLocation();
  }, []);
  
  return { 
    location, 
    errorMsg, 
    isFetching, 
    latitude, 
    longitude, 
    title, 
    description, 
    setLatitude, 
    setLongitude, 
    setTitle, 
    setDescription, 
    fetchLocation, 
    arrivalTime,
    setArrivalTime,
  };
};

export default useLocation;
