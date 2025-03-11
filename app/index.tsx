import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useHandleClicks from '@/hooks/useHandleClicks';
import handleSPLogin from '@/hooks/handleSPLogin'
import { useFonts, ReadexPro_400Regular } from "@expo-google-fonts/readex-pro";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";

export default function Welcome() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ReadexPro: ReadexPro_400Regular,
    MontserratBold: Montserrat_700Bold,
  });
  const {handleCitizenLoginPress,handleCitizenSignUpPress} = useHandleClicks();
  const {onProviderLoginPress} = handleSPLogin();

  if (!fontsLoaded) {
    return null; // or return a loading indicator
  }
  
  return (
      <View style={styles.container}>
        {/* Logo */}
        <Image style={styles.logo} source={require('../app/pictures/unscreen.gif')} />
        
        {/* Slogan */}
        <Text style={styles.slogan}>YOUR SAFETY</Text>
        <Text style={styles.slogan}>IS OUR</Text>
        <Text style={[styles.slogan, styles.priorityText]}>PRIORITY</Text>

        <TouchableOpacity style={styles.buttonServiceProvider} onPress={onProviderLoginPress}>
          <Text style={styles.buttonText}>SERVICE PROVIDER SIGN IN</Text>
        </TouchableOpacity>
        {/* Get Started Button */}
        <TouchableOpacity style={styles.button} onPress={handleCitizenSignUpPress}>
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
        
        {/* Sign In Link */}
        <TouchableOpacity onPress={handleCitizenLoginPress}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E8E8', // Light pink background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150, // Adjust based on your image
    height: 150, // Adjust based on your image
    marginBottom: 30,
  },
  slogan: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000', // Black text
    marginBottom: 0,
    fontFamily: "MontserratBold"
  },
  priorityText: {
    marginBottom: 140
  },
  button: {
    backgroundColor: '#8C1F31', 
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonServiceProvider: {
    backgroundColor: 'black', // Deep maroon for the button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "ReadexPro",
  },
  signInText: {
    color: '#000', // Black text
    fontSize: 14,
    textAlign: 'center',
    fontFamily: "MontserratBold"

  },
  signInLink: {
    color: '#8C1F31', // Maroon text for the link
    fontWeight: 'bold',
    alignSelf: 'center',
    fontFamily: "ReadexPro",

  },
});