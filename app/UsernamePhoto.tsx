import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { FontAwesome, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import usePhoto from '@/hooks/usePhoto'
import useDataInput from '@/hooks/useDataInput'
import useHandleClicks from '@/hooks/useHandleClicks';
import { useFonts, ReadexPro_400Regular } from "@expo-google-fonts/readex-pro";

const UsernamePhoto = () => {
  const {imageUri4,setImageUri4,pickImage,uploadProfile,imageError,setUsername,setPassword,setrepassword,password,passworderr,onPasswordChange} = usePhoto();
  const { handleBackButtonOnUsernamePhotoPress } = useHandleClicks();
  const [fontsLoaded] = useFonts({
    ReadexPro: ReadexPro_400Regular,
  });
  
  if (!fontsLoaded) {
    return null; // or return a loading indicator
  }

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../app/pictures/unscreen.gif')} />
        <Text style={styles.title}>SET UP YOUR ACCOUNT</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          placeholderTextColor="#ccc"
          onChangeText={(text) => setUsername(text)}
        />

          <TextInput
            placeholder="Password"
            style={[styles.input, { borderColor: passworderr ? 'red' : 'green', borderWidth: 1 }]}
            placeholderTextColor="#ccc"
            secureTextEntry
            onChangeText={(text) => onPasswordChange(text)}
          />


       

        <TextInput
          placeholder="Re-enter password"
          style={styles.input}
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={(text) => setrepassword(text)}
        />
      </View>

      {/* Select Photo */}
      <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(setImageUri4)}>
       <FontAwesome name='file-image-o'/>

       {imageUri4 ? (
          <Text style={{fontFamily: "ReadexPro"}}>Select Another Photo</Text>

       ) : (
         <Text style={styles.photoText}>SELECT PHOTO</Text>   
       )}

      </TouchableOpacity>

      {imageError && <Text style={styles.errorText}>{imageError}</Text>}

      {/* Navigation Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBackButtonOnUsernamePhotoPress}>
                  <SimpleLineIcons name="arrow-left" size={16} color="white" />
                  <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={uploadProfile}>
                  <Text style={styles.buttonText}>NEXT</Text>
                  <SimpleLineIcons name="arrow-right" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4DBD7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#800020',
    fontFamily: "ReadexPro",

  },
  inputContainer: {
    width: '80%',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 4,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  photoButton: {
    width: '80%',
    height: 100,
    backgroundColor: '#FAD4D1',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  photoIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    tintColor: '#800020',
  },
  photoText: {
    fontSize: 14,
    color: '#800020',
    fontFamily: "ReadexPro",
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  navButton: {
    backgroundColor: '#800020',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontFamily: "ReadexPro",
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "ReadexPro",
    textAlign: 'center',
  },
});

export default UsernamePhoto;
