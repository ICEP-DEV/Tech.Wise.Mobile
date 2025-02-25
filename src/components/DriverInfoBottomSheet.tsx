import React, { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, Pressable, View, Text, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import BottomSheet from '@gorhom/bottom-sheet';
import { DriverOriginContext } from '../contexts/driverContexts';
import { carTypeData } from '../global/data';
import { Icon } from 'react-native-elements';

const DriverInfoBlurView = ({ route, navigation }) => {
  const { tripAccepted } = route.params;
  const { originDriver } = useContext(DriverOriginContext);

  const [driverDetails, setDriverDetails] = useState(null);
  const [carDetails, setCarDetails] = useState(null);

  const sheetRef = useRef(null);
  const snapPoints = ['10%', '50%'];

  useEffect(() => {
    if (!originDriver?.id) {
      console.warn('No ID found in DriverOriginContext:', originDriver);
      return;
    }

    const flatCars = carTypeData.flatMap(group => group.data);
    const foundCar = flatCars.find(car => String(car.id) === String(originDriver?.id));

    if (foundCar) {
      setDriverDetails(foundCar.driver);
      setCarDetails(foundCar);
    } else {
      console.warn('No car found for the given driver originDriver?.id');
    }
  }, [originDriver]);

  // Open the BottomSheet when tripAccepted is true
  useEffect(() => {
    if (tripAccepted && sheetRef.current) {
      sheetRef.current.expand();
    }
  }, [tripAccepted]);

  if (!originDriver || !driverDetails || !carDetails) {
    return <Text>Loading...</Text>; // Or a spinner
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />

      <BlurView intensity={90} tint="light" style={styles.blurView}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Driver & Car Details</Text>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.detailsRow}>
            <View style={styles.column}>
              {driverDetails ? (
                <>
                  <Text style={styles.detailLabel}>Driver Name:</Text>
                  <Text style={styles.detailText}>{driverDetails.name || 'N/A'}</Text>

                  <Text style={styles.detailLabel}>Location:</Text>
                  <Text style={styles.detailText}>{driverDetails.location || 'N/A'}</Text>

                  <Text style={styles.detailLabel}>Rating:</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.detailText}>{driverDetails.rating || 'N/A'}</Text>
                    <Icon name="star" color="#FFD700" size={16} />
                  </View>

                  <Text style={styles.detailLabel}>Gender:</Text>
                  <Text style={styles.detailText}>{driverDetails.gender || 'N/A'}</Text>
                </>
              ) : (
                <Text style={styles.detailText}>Loading driver details...</Text>
              )}
            </View>

            <View style={styles.column}>
              {carDetails ? (
                <>
                  <Text style={styles.detailLabel}>Car Name:</Text>
                  <Text style={styles.detailText}>{carDetails.name || 'N/A'}</Text>

                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailText}>${carDetails.price || 'N/A'}</Text>

                  <Text style={styles.detailLabel}>Seats:</Text>
                  <Text style={styles.detailText}>{carDetails.seats || 'N/A'}</Text>

                  <View style={styles.promotionContainer}>
                    {carDetails.promotion ? (
                      <>
                        <Text style={[styles.detailLabel, styles.promotion]}>
                        {/* <Icon name="percent" color="#007BFF" size={16} /> */}
                          {carDetails.promotion}% off
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.detailLabel}>No Promotion</Text>
                    )}
                  </View>
                </>
              ) : (
                <Text style={styles.detailText}>Loading car details...</Text>
              )}
            </View>
          </View>

          {/* Profile and Car Image */}
          <View style={styles.imageContainer}>
            {driverDetails.profileImage && (
              <Image source={ driverDetails.profileImage} style={styles.profileImage} resizeMode="cover" />
            )}
            {carDetails.image && (
              <Image source={ carDetails.image } style={styles.carImage} resizeMode="cover" />
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export default DriverInfoBlurView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  blurView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  cancelText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#007aff',
    marginBottom: 10,
  },
  headerContainer: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailContainer: {
    paddingVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingRight: 10,
   },
   noteContainer:{
     marginTop :10 ,
   },
   imageContainer:{
    flex: 1,
    flexDirection :'row',
    justifyContent :'space-between',
     marginTop :10 ,
     alignItems :'center' ,
   },
   profileImage:{
     width :80 ,
     height :80 ,
     borderRadius :40 ,
     marginBottom :10 ,
   },
   carImage:{
     width :100 ,
     height :100 ,
     borderRadius :10 ,
     marginRight :15 ,
   },
   detailLabel:{
     fontSize :14 ,
     fontWeight :'bold',
     marginBottom :5 ,
   },
   detailText:{
     fontSize :16 ,
     marginBottom :15 ,
   },
   ratingContainer:{
     flexDirection :'row',
     alignItems :'center',
   },
   promotionContainer:{
     flexDirection :'row',
     alignItems :'center',
   },
   promotion:{
     marginLeft :5 ,
   }
});
