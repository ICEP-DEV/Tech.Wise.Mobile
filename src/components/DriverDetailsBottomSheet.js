import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { Icon } from 'react-native-elements';
import { DestinationContext } from '../contexts/contexts';
import { carTypeData } from '../global/data';

const DriverDetailsBottomSheet = ({ navigation, route }) => {
  const { dispatchDestination } = useContext(DestinationContext);
  const { id } = route.params;

  const [carData, setCarData] = useState(null);

  // Fetch car data by id
  useEffect(() => {
    const allCars = carTypeData.flatMap((category) => category.data);
    const data = allCars.find((item) => item.id === id);

    if (data) {
      setCarData(data);
    } else {
      console.error('Car data not found for id:', id);
    }
  }, [id]);

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
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />
      
      {/* Driver details at the top */}
      <View style={[styles.driverDetailsTop, isFemale ? styles.femaleBackground : styles.maleBackground]}>
        <Image source={carData.profileImage} style={styles.driverImage} />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{carData.driver.name}</Text>
          <Text style={styles.driverRating}>Rating: {carData.driver.rating}</Text>
          <Text style={styles.driverLicense}>License: {carData.driver.licensePlate}</Text>
          <Text style={styles.driverLocation}>Location: {carData.driver.location}</Text>
          <Text style={styles.driverGender}>Gender: {carData.driver.gender}</Text>
        </View>
      </View>

      {/* BlurView containing car-related details */}
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelContainer}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Car Details</Text>
        </View>

        {/* Car details in a horizontal layout */}
        <View style={styles.carContainer}>
          <View style={styles.carDetails}>
            <Text style={styles.carType}>Type: {carData.name}</Text>
            <Text style={styles.carModel}>Note: {carData.note}</Text>
            <Text style={styles.carPromotion}>Promotion: {carData.promotion}%</Text>
            <Text style={styles.carPrice}>Price: R{carData.price}</Text>
            <Text style={styles.carTime}>ETA: {carData.time}</Text>
          </View>
          <Image source={carData.image} style={styles.carImage} />
        </View>

        <Pressable style={styles.confirmButton}>
          <Text style={styles.confirm}>Confirm Pickup</Text>
        </Pressable>
      </BlurView>

    </View>
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
    // marginTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    
  },
  femaleBackground:{
     backgroundColor:'#f8d3e8', // Light pink background for female drivers
   },
   maleBackground:{
     backgroundColor:'#fff', // Default white background for male drivers
   },
   driverImage: {
     width: 70,
     height: 70,
     borderRadius: 35, // Circular image
     marginRight: 15,
     backgroundColor: '#e0e0e0',
     resizeMode: 'cover',
     
   },
   driverInfo: {
     flexGrow: 1,
   },
   driverName: {
     fontSize: 22,
     fontWeight: 'bold',
     color:'#333',
   },
   driverRating:{
     fontSize :16 ,
     color :'#FFD700' , // Gold color for rating stars
     marginTop :4
   },
   driverLicense:{
     fontSize :14 ,
     color :'#007BFF' ,
     marginTop :2
   },
   driverLocation:{
     fontSize :14 ,
     color :'#28a745' ,
     marginTop :2
   },
   driverGender:{
     fontSize :14 ,
     color :'#6c757d' ,
     marginTop :2
   },
   blurView:{
     height:'40%', 
     width:'100%',
     position:'absolute',
     bottom :0 ,
     borderTopLeftRadius :20 ,
     borderTopRightRadius :20 ,
     overflow:'hidden',
     paddingVertical :30 ,
     paddingHorizontal :20 ,
     backgroundColor:'#fff' ,
     zIndex :1
   },
   cancelContainer:{
     alignSelf:'flex-end'
   },
   cancelText:{
     fontSize :16 ,
     fontWeight :'600' ,
     color:'#FF3B30'
   },
   headerContainer:{
     marginTop :10 ,
     marginBottom :20 ,
     alignItems :'center'
   },
   headerText:{
     fontSize :24 ,
     fontWeight :'bold' ,
     color :'#333'
   },
   carContainer:{
     flexDirection:'row', // Horizontal layout for car image and details
     alignItems:'center', // Center vertically
     marginTop :10,
   },
   carImage:{
     width :100 , // Adjusted size for car image
     height :70 ,
     borderRadius :10 ,
     marginRight :15, // Space between image and text
   },
   carDetails:{
      flexGrow :1, // Allow this view to grow and take available space
   },
   carType:{
     fontSize :18 ,
     fontWeight :'bold' ,
     color :'#333'
   },
   carModel:{
     fontSize :16 ,
     color :'#6c757d' ,
     marginTop :4
   },
   carPromotion:{
     fontSize :16 ,
     color :'#007BFF' ,
     marginTop :4
   },
   carPrice:{
     fontSize :18 ,
     fontWeight :'bold' ,
     color :'#28a745' , // Green for price
     marginTop :4
   },
   carTime:{
      fontSize :14 , 
      color :'#6c757d' , 
      marginTop :4 
   },
 confirmButton:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#007aff', // Primary button color
      paddingVertical :12,
      paddingHorizontal :15,
      borderRadius :8,
      marginTop :15,
      justifyContent:'center'
   },
 confirm:{
       color:'#fff', // White text on button
       fontWeight:'bold',
       marginLeft :5
 }
});