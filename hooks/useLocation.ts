import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [arrivalTime, setArrivalTime] = useState<number | string | null>(null);
  

  


 
  function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: NodeJS.Timeout | null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const handleArrivalTime = (distance: number) => {
    console.log("Distance received in handleArrivalTime:", distance);
    let newTime;
    if (distance > 14000) {
      newTime = "Go to the nearest station";
    } else if (distance >= 13000) {
      newTime = 30;
    } else if (distance >= 12000) {
      newTime = 20;
    } else if (distance >= 10000) {
      newTime = 18;
    } else if (distance >= 8000) {
      newTime = 16;
    } else if (distance >= 5000) {
      newTime = 14;
    } else if (distance >= 3000) {
      newTime = 10;
    } else if (distance >= 1000) {
      newTime = 7;
    } else if (distance > 0) {
      newTime = 1;
    } else {
      newTime = "Calculating";
    }
    console.log("New arrival time set to:", newTime);
    setArrivalTime(newTime); // This should trigger a re-render
  };
  
  

  
  

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
    handleArrivalTime,
    arrivalTime,
    setArrivalTime,
  };
};

export default useLocation;
