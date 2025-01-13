import React, { useState } from 'react';
import { ScrollView, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { images, icons } from '../constants/index'; // Adjust the import path as needed
import { colors, parameters } from '../global/styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Icon library for email/password icons
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';

const LoginScreen = () => {
  const navigation = useNavigation(); // Initialize navigation hook

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    navigation.navigate('Home'); // Navigate to the "Home" screen
  };

  const handleGoogleLogin = () => {
    Alert.alert('Info', 'Google login is not yet implemented.');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/NthomeLogin.png')} // Background Image
      style={styles.backgroundImage}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          {/* Centered Text */}
          <View style={styles.centeredTextContainer}>
            {/* <Text style={styles.titleText}>Welcome Back!</Text> Wrapped title text in <Text> */}
          </View>

          {/* Logs Button */}
          {/* <TouchableOpacity style={styles.logButton} onPress={() => navigation.navigate('Logs')}>
            <Text style={styles.logButtonText}>Logs</Text> 
          </TouchableOpacity> */}
        </View>

        {/* Form Inputs moved down */}
        <View style={styles.formContainer}>
          {/* Email Input */}
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(value) => handleInputChange('email', value)}
            icon="envelope" // FontAwesome icon for email
          />

          {/* Password Input */}
          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => handleInputChange('password', value)}
            icon="lock" // FontAwesome icon for password
          />

          {/* Login Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text> {/* Wrapped button text in <Text> */}
          </TouchableOpacity>

          {/* Google Login Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image source={icons.google} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>Log In with Google</Text> {/* Wrapped button text in <Text> */}
          </TouchableOpacity>

          {/* Don't Have an Account? */}
          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}> {/* Wrapped text inside <Text> */}
              Don’t have an account? <Text style={styles.linkHighlight}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry = false, icon }) => (
  <View style={styles.inputField}>
    <Text style={styles.inputLabel}>{label}</Text> {/* Wrapped label in <Text> */}
    <View style={styles.inputContainer}>
      <Icon name={icon} size={20} color="gray" style={styles.inputIcon} /> {/* Icon added here */}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  </View>
);

const styles = {
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align top first
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 350, // Add margin to move content down
  },
  logButton: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  logButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 24,
    color: 'white', // Change text color to white for better contrast
    fontFamily: 'JakartaSemiBold',
    textAlign: 'center', // Horizontally center the text
    paddingBottom: 20, // Added padding for spacing
  },
  centeredTextContainer: {
    marginBottom: 30, // Added bottom margin for spacing
  },
  formContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 25, // Added horizontal padding to match with contentContainer
    // marginTop: 30, // Added margin to push the form down further
    backgroundColor: "white",
    borderRadius: 12, //radius of the form for 
    opacity: 0.9,
    padding: 50, // padding to push the compnents down from the top margin of the form
  },
  inputField: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 18,
    color: 'black', // Change input label color to white for visibility
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Add background for better visibility
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: 'black',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  linkText: {
    color: ' black', // Change link text color to white for visibility
    fontSize: 16,
  },
  linkHighlight: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
};

export default LoginScreen;
