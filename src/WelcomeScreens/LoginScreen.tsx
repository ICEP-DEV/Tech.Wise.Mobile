import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { images } from '../constants/index'; // Adjust the import path as needed
import { colors, parameters } from '../global/styles';
import { auth, db } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions/authActions'; // Import the setUser action
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import necessary functions from Firestore (v9+ modular SDK)
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state
  const [authenticating, setAuthenticating] = useState(false); // For login button loading
  const dispatch = useDispatch(); // Redux dispatch function
  const [user_Id, setUser_Id] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userAuth, setUserAuth] = useState(null);

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          name: user.displayName,
          email: user.email,
          id: user.uid,
        })); // Store user details in Redux
        navigation.replace('DrawerNavigator');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigation, dispatch]);
  const signIn = async () => {
    setAuthenticating(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Ensure email verification status is up-to-date
      await user.reload();
  
      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        navigation.navigate('ProtectedScreen');
        return;
      }
  
      // Retrieve user data from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        alert('User not found.');
        return;
      }
  
      const userData = userDoc.data();
      console.log("User data from Firestore:", userData);
  
      // Check if the user is a driver
      if (userData.role !== 'driver') {
        alert('Only drivers are allowed to log in.');
        navigation.replace('LogoutPage');
        return;
      }
  
      // Store user details in AsyncStorage
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('emailVerified', 'true');
  
      setUserId(user.uid);
      setUserAuth(user);
      
      // Dispatch user details to Redux
      dispatch(setUser({
        name: user.displayName,
        email: user.email,
        id: user.uid,
        role: userData.role,
      }));
  
      // Call fetchDriverUserID and pass user and userData
      fetchDriverUserID(user, userData);  // Pass both user and userData here
    } catch (error) {
      console.log(error);
      alert('Sign in failed, please check your email and password');
    } finally {
      setAuthenticating(false);
    }
  };
  
  const fetchDriverUserID = async (user, userData) => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/login', {
        email,
        password,
      });
      console.log("user_id Response:", response.data);
  
      const user_id = response.data.id;
      setUser_Id(user_id);
      console.log("user_id:", user_id);
  
      // Dispatch updated user data to Redux with user_id and userData (role)
      dispatch(setUser({
        name: user.displayName,  // Use user data passed from signIn
        email: user.email,
        id: user.uid,
        role: userData.role,  // Use role from userData
        user_id: user_id,     // Add user_id from API response
      }));
    } catch (error) {
      console.error("Error fetching driver id:", error);
    }
  };
  


  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ position: 'relative' }}>
          <Image source={images.signUpCar} style={{ width: '100%', height: 250 }} />
          <Text style={styles.titleText}>Welcome Back!</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {authenticating ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
                <Text style={styles.primaryButtonText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.linkText}>
                  Don’t have an account? <Text style={styles.linkHighlight}>Sign up</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
              >
                <Text style={styles.linkHighlight}>Forgot Password?</Text>
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
    color: 'black',
    fontSize: 16,
  },
  linkHighlight: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
};
export default LoginScreen;
