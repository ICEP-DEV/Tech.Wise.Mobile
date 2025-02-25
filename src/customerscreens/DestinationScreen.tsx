import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors, parameters } from '../global/styles';
import { DestinationContext, OriginContext } from '../contexts/contexts';
import { DriverOriginContext } from '../contexts/driverContexts';
import MapComponent from '../components/MapComponent';
import axios from 'axios';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomDrawer from '../components/CustomDrawer'; // Import your Custom Drawer
import { Ionicons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const DestinationScreen = ({ navigation, route }) => {
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Toggle drawer state
  };

  const { driver_id = null, tripAccepted = false, paymentConfirmed = false } = route.params || {};

  const { originDriver } = useContext(DriverOriginContext);
  const { origin } = useContext(OriginContext);
  const { destination } = useContext(DestinationContext);

  const [userOrigin, setUserOrigin] = useState({
    latitude: origin?.latitude,
    longitude: origin?.longitude,
  });
  const [userDestination, setUserDestination] = useState({
    latitude: destination?.latitude,
    longitude: destination?.longitude,
  });

  const [driverLocation, setDriverLocation] = useState({
    latitude: originDriver?.latitude,
    longitude: originDriver?.longitude,
  });

  const [eta, setEta] = useState(null); // State for ETA
  const [distance, setDistance] = useState(null); // State for distance

  useEffect(() => {
    if (!tripAccepted || !paymentConfirmed) {
      navigation.navigate('TripLoadingResponse', { durationReacheds: false });
    }
  }, [tripAccepted, paymentConfirmed]);

  useEffect(() => {
    if (userOrigin.latitude && userOrigin.longitude && driverLocation.latitude && driverLocation.longitude) {
      const fetchRouteDetails = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/directions/json`,
            {
              params: {
                origin: `${userOrigin.latitude},${userOrigin.longitude}`,
                destination: `${driverLocation.latitude},${driverLocation.longitude}`,
                key: GOOGLE_MAPS_APIKEY,
              },
            }
          );
          const route = response.data.routes[0];
          const leg = route.legs[0];

          setEta(leg.duration.text); // ETA in human-readable format
          setDistance(leg.distance.text); // Distance in human-readable format
        } catch (error) {
          console.error("Error fetching route details:", error);
        }
      };
      fetchRouteDetails();
    }
  }, [userOrigin, driverLocation]);

  const handleNavigation = () => {
    if (destination && destination.latitude && destination.longitude) {
      navigation.navigate('DriverInfoBottomSheet', {
        durationReacheds: true,
        driver_id: driver_id,
        tripAccepted: tripAccepted,
      });
    }
  };

  const closeDrawerOnTapOutside = () => {
    if (drawerOpen) {
      setDrawerOpen(false); // Close the drawer when tapped outside
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={closeDrawerOnTapOutside}>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={toggleDrawer}
              style={styles.roundButton}
            >
              <Icon type="material-community" name="menu" color={colors.black} size={30} />
            </TouchableOpacity>
          </View>

          {drawerOpen && (
            <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} />
          )}
          {/* Profile Picture */}
          <TouchableOpacity
            style={styles.profilePictureContainer}
            onPress={() => navigation.navigate('DriverCommunicationBottomSheet')}
          >
            <Image
              source={require('../../assets/call.png')}
              style={styles.profilePicture}
            />
          </TouchableOpacity>

          {/* Navigate Button */}
          <TouchableOpacity style={styles.rectangleButton} onPress={handleNavigation}>
            <Text style={styles.buttonText}>View Driver</Text>
          </TouchableOpacity>

          {/* Map Component */}
          <MapComponent
            driverLocation={driverLocation}
            driverId={driver_id}
            userOrigin={tripAccepted ? userOrigin : null}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default DestinationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view1: {
    position: "absolute",
    top: 25,
    left: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    zIndex: 99999,
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 25,
    right: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    zIndex: 10,
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  view2: {
    backgroundColor: colors.white,
    zIndex: 4,
    paddingBottom: 10,
    flex: 1,
  },
  rectangleButton: {
    backgroundColor: '#0092FF', // Deep purple button
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,          // Slightly rounded corners
    width: '100%',              // Button width (adjust as needed)
    height: 50,                // Button height
    justifyContent: 'center',  // Center text vertically
    alignItems: 'center',      // Center text horizontally
    position: 'absolute',      // Absolute positioning
    bottom: -2,                // Distance from the bottom
    alignSelf: 'center',       // Center horizontally on the screen
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.3,        // Shadow transparency
    shadowRadius: 4,           // Shadow radius
    elevation: 5,              // Elevation for Android shadow
    zIndex: 1,                 // Ensure it's above other components
  },
  buttonText: {
    color: 'white',            // Text color
    fontSize: 16,              // Font size
    fontWeight: 'bold',        // Bold text
  },
  routeInfoContainer: {
    position: 'absolute',
    top: 80,
    left: SCREEN_WIDTH / 2 - 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 10,
    width: 200,
  },
  routeInfoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    position: "absolute", // Ensures it floats on top of the screen
    top: 50, // Adjust for slight padding at the top
    left: 10, // Adjust for slight padding at the left
    zIndex: 100, // Ensures it's above other elements
  },
  roundButton: {
    backgroundColor: "#fff", // Add a background color
    borderRadius: 30, // Make it round (half of the width/height)
    width: 50, // Diameter of the circle
    height: 50, // Diameter of the circle
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
    shadowColor: "#000", // Add shadow (optional)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android
  },
});
