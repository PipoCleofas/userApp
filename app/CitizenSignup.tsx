import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet, Pressable, Modal, Image } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import useHandleClicks from '@/hooks/useHandleClicks';
import Barangay from '@/components/Barangay';
import Sitio from '@/components/Sitio';
import useDataInput from '@/hooks/useDataInput';
import Gender from '@/components/Gender'

export default function CitizenSignup() {

  const { handleBackButtonOnSignupPress} = useHandleClicks();
  
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { onBirthdayChange, 
          handleChangeState,
          barangay, 
          sitio, 
          handleNextPressSignup, 
          handleBarangayChange, 
          handleSitioChange, 
          state } = useDataInput();


          return (
            <View style={styles.container}>
              {/* Logo */}
              <Image style={styles.logo} source={require('../app/pictures/unscreen.gif')} />
        
              {/* Title */}
              <Text style={styles.title}>Create an Account</Text>
        
              {/* Input Fields */}
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#888"
                onChangeText={(text) => handleChangeState('firstname', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Middle Name"
                placeholderTextColor="#888"
                onChangeText={(text) => handleChangeState('middlename', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#888"
                onChangeText={(text) => handleChangeState('lastname', text)}
              />

              <Gender
                value={state.gender!}
                onValueChange={(text) => handleChangeState('gender', text)}
              />

              <TextInput
                style={styles.input}
                maxLength={10}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#cccccc"
                keyboardType="numeric"
                value={state.birthdate ? state.birthdate.toString() : undefined}
                onChangeText={(text) => onBirthdayChange(text)}
              />
        
               {/* Sitio Picker */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Sitio*</Text>
                <Sitio value={sitio} onValueChange={handleSitioChange} />
              </View>

              {/* Barangay Picker */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Barangay*</Text>
                <Barangay value={barangay} onValueChange={handleBarangayChange} />
              </View>

              {state.error && <Text style={styles.errorText}>{state.error}</Text>}

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBackButtonOnSignupPress}>
                  <SimpleLineIcons name="arrow-left" size={16} color="white" />
                  <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNextPressSignup}>
                  <Text style={styles.buttonText}>NEXT</Text>
                  <SimpleLineIcons name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              

            </View>
          );
        }
        
        const styles = StyleSheet.create({
          errorText: {
            color: 'red',
            fontSize: 14,
            marginBottom: 4,
            textAlign: 'center',
          },
          dropdownContainer: {
            width: '85%',
            marginBottom: 15,
          },
          label: {
            fontSize: 14,
            color: '#333',
            marginBottom: 2,
            marginLeft: 10, // Add this line to move the label slightly to the right
          },
          
          container: {
            flex: 1,
            backgroundColor: '#F8E8E8',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          },
          logo: {
            width: 150,
            height: 150,
            marginBottom: 20,
          },
          title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000',
            marginBottom: 20,
            textAlign: 'center',
          },
          input: {
            width: '85%',
            backgroundColor: '#FFF',
            padding: 6,
            borderRadius: 10,
            marginBottom: 15,
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#CCC',
            alignSelf: 'center',
          },
          button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40%', // Make the buttons thinner
            paddingVertical: 10, // Adjust padding for a slimmer appearance
            borderRadius: 25,
            marginHorizontal: 10, // Add horizontal margin to create a gap
          },
          backButton: {
            backgroundColor: '#8C1F31',
          },
          nextButton: {
            backgroundColor: '#8C1F31',
          },
          buttonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 8, // Spacing between the icon and text
          },
          icon: {
            marginHorizontal: 4, // Adjust icon spacing if needed
          },
        });
        
