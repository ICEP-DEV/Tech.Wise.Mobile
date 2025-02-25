import React, { useContext, useMemo, useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, Image, Animated, View, Text, Alert } from 'react-native';
import { DestinationContext } from '../contexts/contexts';
import BottomSheet from '@gorhom/bottom-sheet';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown
import { Icon } from 'react-native-elements';

const TripLoadingResponse = ({ navigation, route }) => {
  const { dispatchDestination } = useContext(DestinationContext);
  const { durationReacheds, driverLocation } = route.params;
  console.log('Route Params:', route.params);

  // console.log('Driver Location2222222222222222222222222:', driverLocation);

  // State for button text and selected payment method
  // const [buttonText, setButtonText] = useState('Waiting for Response...');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash'); // Default payment method
  const [durationReached, setDurationReached] = useState(durationReacheds || false);

  // Snap points for Bottom Sheet
  const snapPoints = useMemo(() => ['40%'], []);

  // Animation for loading bar
  const loadingAnimation = useRef(new Animated.Value(durationReached ? 1 : 0)).current;

  const [scale] = useState(new Animated.Value(1)); // Initial scale value
  const [opacity] = useState(new Animated.Value(1)); // Initial opacity value
  useEffect(() => {
    // Looping animation for scale and opacity
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2, // Scale to 1.2
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1, // Back to 1
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6, // Fade out
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1, // Fade back in
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start(); // Start the animation loop
  }, []);
  // Function to handle payment method selection
  useEffect(() => {
    if (durationReacheds) {
      // If durationReacheds is true, immediately set the button text
      // setButtonText('Continue to Payment');
      setDurationReached(true);
    } else {
      // Start the loading animation if durationReacheds is false
      Animated.timing(loadingAnimation, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: false,
      }).start();

      // Alert after animation is done
      const timeoutId = setTimeout(() => {
        alert('Trip accepted/declined!');
        // setButtonText('Continue to Payment');
        setDurationReached(true);
        handleButtonClick();
      }, 10000); // Trigger after 10 seconds (end of animation)

      // Cleanup the timeout when component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [durationReacheds]);

  // Interpolating the width of the loading bar
  const loadingBarWidth = durationReached
    ? '100%'
    : loadingAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

  // Function to handle button click
  const handleButtonClick = () => {
    if (selectedPaymentMethod) {
      // Alert.alert('Payment Method', `You have selected ${selectedPaymentMethod}.`);

      // Navigate to DestinationScreen with parameters
      navigation.navigate('DestinationScreen', {
        tripAccepted: true,
        paymentConfirmed: true,
        // driverLocation: driverLocation,
      });
    } else {
      Alert.alert('Error', 'Please select a payment method.');
    }
  };

  // Images for payment methods
  const paymentImages = {
    'Cash': require('../../assets/money.png'), // Replace with your cash icon path
    'Credit Card': require('../../assets/mastercard.png'), // Replace with your MasterCard logo path
  };
  const cardNumber = '123354846569';

  return (
    <View style={styles.container}>
      {/* Overlay to close Bottom Sheet */}
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />

      <BottomSheet
        snapPoints={snapPoints}
        index={0} // Initial snap point
        enablePanDownToClose={false}
        onClose={() => navigation.goBack()}
        style={styles.bottomSheet}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Sedan</Text>
          <Text style={styles.licensePlate}>License Plate: ABC1234</Text>
        </View>

        {/* Car Details Section */}
        <View style={styles.carContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // Replace with car image URL
            style={styles.carImage}
          />
          <View style={styles.carDetails}>
            <Text style={styles.carModel}>Model: Toyota Corolla</Text>
            <Text style={styles.carPromotion}>Promotion: 10% Off</Text>
            <Text style={styles.carPrice}>Price: R250</Text>
            <Text style={styles.carTime}>Estimated Time: 5 mins</Text>
          </View>
        </View>

        {/* Loading Bar */}
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingBar, { width: loadingBarWidth }]} />
        </View>

        <View style={styles.loadingTextContainer}>
      <Animated.Text style={[styles.loadingText, { transform: [{ scale }], opacity }]}>
        Waiting for driver response
      </Animated.Text>
    </View>
      </BottomSheet>
    </View>
  );
};

export default TripLoadingResponse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
  },
  overlay: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  carContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa', // Light background for card effect
    borderRadius: 10,
    elevation: 2,
    paddingVertical: 10,
  },
  carImage: {
    width: 100,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  carDetails: {
    flex: 1,
  },
  carModel: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  carPromotion: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 4,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 4,
  },
  carTime: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
  },
  // picker: {
  //   height: 50,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 8,
  // },
  // paymentImageContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 16,
  //   backgroundColor: '#f8f9fa',
  //   borderRadius: 10,
  //   elevation: 1,
  // },
  // paymentImage: {
  //   width: 40,
  //   height: 40,
  //   marginRight: 10,
  // },
  cardInfo: {
    fontSize: 18,
    color: '#333',
    marginLeft: -10,
    alignSelf: 'center',
  },
  loadingContainer: {
    height: 5,
    width: '100%',
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: '#007aff',
  },
  confirmButton: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirm: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingTextContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    // backgroundColor: '#f8f8f8',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
});
