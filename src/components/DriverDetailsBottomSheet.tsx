import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Image, Alert } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { Icon } from 'react-native-elements';
import { DestinationContext } from '../contexts/contexts';
import { DriverOriginContext } from '../contexts/driverContexts';
import { carTypeData } from '../global/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown

const DriverDetailsBottomSheet = ({ navigation, route }) => {
  const { dispatchDestination } = useContext(DestinationContext);
  const { dispatchOrigin } = useContext(DriverOriginContext);
  // driver id
  const { id } = route.params;
  // console.log('Driver id DriverDetailsBottomSheet55:', id);

  const [carData, setCarData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash'); // Default payment method


  // Fetch car data by id
  useEffect(() => {
    const allCars = carTypeData.flatMap((category) => category.data);
    const data = allCars.find((item) => item.id === id);

    if (data) {
      setCarData(data);
      // console.log('Car id from DriverDetailsBottomSheet:', data.id);

      // Dispatch the car details and driver info to the context
      dispatchOrigin({
        type: 'ADD_ORIGIN',
        payload: {
          id: data.id,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          address: data.driver.location || '',
          name: data.driver.name || '',
        },
      });
    } else {
      console.error('Car data not found for id:', id);
    }
  }, [id]);
  // Function to handle button click
  const handleButtonClick = () => {
    if (selectedPaymentMethod) {
      // Alert.alert('Payment Method', `You have selected ${selectedPaymentMethod}.`);

      // Navigate to DestinationScreen with parameters
      navigation.navigate('DestinationScreen', {
        driver_id: id,
        tripAccepted: false,
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

  if (!carData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Determine color scheme based on gender
  const isFemale = carData.driver.gender.toLowerCase() === 'female';

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />

      {/* BlurView containing car-related details */}
      <BlurView style={[styles.blurView, isFemale ? styles.femaleBackground : styles.maleBackground]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelContainer}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Driver Details</Text>
        </View>

        {/* Car details in a horizontal layout */}
        <View style={styles.carContainer}>
          <View style={styles.carDetails}>
            <Text style={styles.carType}>{carData.driver.name}</Text>
            <Text style={styles.carModel}>Rating: {carData.driver.rating}</Text>
            <Text style={styles.carPromotion}>Promotion: {carData.promotion}%</Text>
            <Text style={styles.carPrice}>Price: R{carData.price}</Text>
            <Text style={styles.carTime}>ETA: {carData.time}</Text>

          </View>
          <Image source={carData.driver.profileImage} style={styles.driverImage} />
        </View>
        {/* Payment Method Dropdown */}
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedPaymentMethod}
            onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="Credit Card" value="Credit Card" />
          </Picker>
        </View>

        {/* Display Selected Payment Method Image */}
        <View style={styles.paymentImageContainer}>
          <Image
            source={paymentImages[selectedPaymentMethod]}
            style={styles.paymentImage}
          />
          {selectedPaymentMethod === 'Credit Card' && (
            <Text style={styles.cardInfo}>**** **** **** {cardNumber.slice(-4)}</Text>
          )}
        </View>

        <Pressable
          style={styles.confirmButton}
          onPress={() => handleButtonClick()}
        >
          <Text style={styles.confirm}>Confirm Pickup</Text>
        </Pressable>
      </BlurView>
    </SafeAreaView>
  );
};

export default DriverDetailsBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Light gray background for modern feel
  },
  overlay: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: '50%',
    fontSize: 18,
    color: '#333',
  },
  driverDetailsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure items are spaced well
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, // Safe area padding for iOS
    paddingBottom: 10,
    backgroundColor: '#fff', // Ensure a consistent background
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    position: 'absolute',
    top: 0, // Consistent position at the top
    left: 0,
    right: 0,
    zIndex: 10,
    width: '100%', // Ensure it spans the entire width of the screen
  },

  femaleBackground: {
    backgroundColor: '#f8d3e8', // Light pink background for female drivers
  },
  maleBackground: {
    backgroundColor: '#fff', // Default white background for male drivers
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 35, // Circular image
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    resizeMode: 'cover',

  },
  driverInfo: {
    marginTop: 20,
    flexGrow: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  driverRating: {
    fontSize: 16,
    color: '#FFD700', // Gold color for rating stars
    marginTop: 4
  },
  driverLicense: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 2
  },
  driverLocation: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 2
  },
  driverGender: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2
  },
  blurView: {
    height: '50.5%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    zIndex: 1
  },
  cancelContainer: {
    alignSelf: 'flex-end'
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30'
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  carContainer: {
    flexDirection: 'row', // Horizontal layout for car image and details
    alignItems: 'center', // Center vertically
    //  marginTop :10,
  },
  carImage: {
    width: 100, // Adjusted size for car image
    height: 70,
    borderRadius: 10,
    marginRight: 15, // Space between image and text
  },
  carDetails: {
    flexGrow: 1, // Allow this view to grow and take available space
  },
  carType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  carModel: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4
  },
  carPromotion: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 4
  },
  carPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745', // Green for price
    marginTop: 4
  },
  carTime: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff', // Primary button color
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    justifyContent: 'center'
  },
  confirm: {
    color: '#fff', // White text on button
    fontWeight: 'bold',
    marginLeft: 5
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
  },
  paymentImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    elevation: 1,
  },
  paymentImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});