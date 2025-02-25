import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { images } from '../constants/index'; // Adjust the import path as needed
import { colors, parameters } from '../global/styles';
import { auth, db } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions/authActions'; // Import the setUser action
import AsyncStorage from '@react-native-async-storage/async-storage';

import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading state
  const [authenticating, setAuthenticating] = useState(false); // For login button loading
  const dispatch = useDispatch(); // Redux dispatch function
  const user = auth.currentUser;
  console.log('-------------', user?.emailVerified);
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
  
      // Check if the email is verified
      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        navigation.navigate('ProtectedScreen');
        return; // Stop further execution
      }
  
      // Retrieve user data from Firestore (using Firestore modular API)
      const userRef = doc(db, 'users', user.uid); // Reference to the user's document
      const userDoc = await getDoc(userRef); // Get the user document data
      if (!userDoc.exists()) {
        alert('User not found.');
        return; // Stop further execution
      }
  
      const userData = userDoc.data();
  
      // Log the user data to inspect if the 'role' is correctly retrieved
      console.log("User data from Firestore:", userData);
  
      // Check if the user is a customer (role === 'user')
      if (userData.role !== 'user') {
        alert('Only users with a customer role are allowed to log in.');
        navigation.replace('LogoutPage');

        return; // Immediately return to stop sign-in
      } else{
  
      // Store user details in AsyncStorage
      await AsyncStorage.setItem('userId', user.uid);
      await AsyncStorage.setItem('emailVerified', 'true'); // Store verification status
  
      // Dispatch user details to Redux
      dispatch(setUser({
        name: user.displayName,
        email: user.email,
        id: user.uid,
        role: userData.role, // Store user role as well
      }));
  
      // Navigate to DrawerNavigator
      navigation.replace('DrawerNavigator');
    }
      
    } catch (error) {
      console.log(error);
      alert('Sign in failed, please check your email and password');
    } finally {
      setAuthenticating(false);
    }
  };
  // if (loading) {
  //   // Show a full-screen loader while checking authentication status
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ position: 'relative' }}>
          <Image source={images.signUpCar} style={{ width: '100%', height: 835 }} />
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
    fontSize: 35,
    color: 'black',
    fontFamily: 'JakartaSemiBold',
    position: 'absolute',
    bottom: 370,
    left: 85,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    position: 'absolute',
    top: 462, // Adjusted this value to push the form down
    width: '100%',
    backgroundColor: 'white',
    // opacity: 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputField: {
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    
  },
  input: {
    borderWidth: 2,
    borderColor: 'black', // Border only on the input box
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
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
