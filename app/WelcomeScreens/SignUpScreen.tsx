import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, View, Image, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { images, icons } from '../constants/index'; // Adjust the import path as needed
import { useState } from 'react';

const SignUpScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSignUp = (userType) => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    console.log(`User signed up as ${userType} with:`, form);

    // Navigate to specific signup page based on user type
    if (userType === 'driver') {
      navigation.navigate('DriverUploadDocuments'); // Adjust with actual screen name in your navigation stack
    } else if (userType === 'rider') {
      navigation.navigate('RiderUploadDocuments'); // Adjust with actual screen name in your navigation stack
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google Sign Up clicked');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/NthomeLogin.png')} // Background Image
      style={styles.backgroundImage} // Ensuring ImageBackground fills the screen
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Header Image */}
          <View style={{ position: 'relative' }}>
            {/* <Image
              source={images.signUpCar} // Ensure this path is correct
              style={{ width: '100%', height: 250 }}
            /> */}
            <Text style={styles.titleText}>Create your account</Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {/* Name Input */}
            <InputField
              label="Name"
              placeholder="Enter your name"
              value={form.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />

            {/* Email Input */}
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={form.email}
              onChangeText={(value) => handleInputChange('email', value)}
            />

            {/* Password Input */}
            <InputField
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={form.password}
              onChangeText={(value) => handleInputChange('password', value)}
            />

            {/* Sign Up as Driver Button */}
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: 'blue' }]}
              onPress={() => handleSignUp('driver')}
            >
              <Text style={styles.primaryButtonText}>Sign Up as Driver</Text>
            </TouchableOpacity>

            {/* Sign Up as Rider Button */}
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: 'green', marginTop: 10 }]}
              onPress={() => handleSignUp('rider')}
            >
              <Text style={styles.primaryButtonText}>Sign Up as Rider</Text>
            </TouchableOpacity>

            {/* Google Sign Up Button */}
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
              <Image
                source={icons.google} // Ensure this path is correct
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Sign Up with Google</Text>
            </TouchableOpacity>

            {/* Already Have an Account */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => { navigation.navigate("LoginScreen") }} // Adjust with actual screen name
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkHighlight}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry = false }) => (
  <View style={styles.inputField}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={styles.input}
    />
  </View>
);

const styles = {
  backgroundImage: {
    flex: 1, // Ensure it fills the screen
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  titleText: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'JakartaSemiBold',
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  formContainer: {
    padding: 20,
    marginTop: 350, // *** Added this line to push the form down from the top ***
    backgroundColor: 'white',
    borderRadius: 10, // Optional: to make it look more polished
    opacity: 0.9, // Optional: for a slight transparent effect
  },
  inputField: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
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
    color: 'black',
    fontSize: 16,
  },
  linkHighlight: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
};

export default SignUpScreen;
