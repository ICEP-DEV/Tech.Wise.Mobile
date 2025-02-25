import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { images } from '../constants/index'; // Adjust the import path as needed
import { colors, parameters } from '../global/styles';
import { auth, db } from '../../FirebaseConfig'; // Ensure Firestore is exported in FirebaseConfig.js
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth'; // Add sendEmailVerification
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(''); // New state for gender
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (!gender) {
      alert('Please select your gender.');
      return;
    }
  
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }
  
    setLoading(true);
    try {
      // Create user with email and password
      const response = await createUserWithEmailAndPassword(auth, email, password);
  
      // Update profile with the name
      await updateProfile(response.user, { displayName: name });
  
      // Store user data in Firestore
      const userRef = doc(db, 'users', response.user.uid);
      await setDoc(userRef, {
        name,
        email,
        gender,
        role: 'driver', // Default role
        createdAt: new Date().toISOString(),
      });
  
      // Send user data to your backend
      await axios.post('http://10.0.2.2:3000/api/register', {
        name,
        email,
        password,
        role: 'driver',
        gender,
        user_uid: response.user.uid,
      });
      
  
      // Send email verification
      await sendEmailVerification(response.user);
  
      alert('Account created successfully! Please check your email for verification before logging in.');
  
      // Force logout to prevent auto-login after signup
      await signOut(auth);
  
      // Redirect to LoginScreen
      navigation.replace('ProtectedScreen');
    } catch (error) {
      console.error('Sign up failed:', error.message);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header Image */}
        <View style={{ position: 'relative' }}>
          <Image
            source={images.signUpCar} // Ensure this path is correct
            style={{ width: '100%', height: 250 }}
          />
          <Text style={styles.titleText}>Create your account</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formContainer}>
          {/* Name Input */}
          <InputField
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          {/* Email Input */}
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          {/* Password Input */}
          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderOptions}>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'male' && styles.selectedGenderOption,
                ]}
                onPress={() => setGender('male')}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === 'male' && styles.selectedGenderText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderOption,
                  gender === 'female' && styles.selectedGenderOption,
                ]}
                onPress={() => setGender('female')}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === 'female' && styles.selectedGenderText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: 'blue' }]}
                onPress={signUp}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* Already Have an Account */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('LoginScreen')} // Adjust with actual screen name
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkHighlight}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
  genderContainer: {
    marginBottom: 15,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '45%',
    alignItems: 'center',
  },
  selectedGenderOption: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  genderText: {
    color: 'black',
  },
  selectedGenderText: {
    color: 'white',
    fontWeight: 'bold',
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
