import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, Text, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors, parameters } from '../global/styles';
import { DestinationContext, OriginContext } from '../contexts/contexts';
import MapComponent from '../components/MapComponent';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { RequestsData } from '../global/data'; // Import the RequestsData
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PendingRequests({ navigation }) {
  // Accessing the contexts for origin and destination
  const { origin } = useContext(OriginContext);
  const { destination } = useContext(DestinationContext);

  // Setting up the userOrigin and userDestination state
  const [userOrigin, setUserOrigin] = useState({
    latitude: origin?.latitude ?? 0,
    longitude: origin?.longitude ?? 0,
  });

  const [userDestination, setUserDestination] = useState({
    latitude: destination?.latitude ?? 0,
    longitude: destination?.longitude ?? 0,
  });

  // Update the state whenever the context values change
  useEffect(() => {
    if (origin?.latitude && origin?.longitude) {
      setUserOrigin({
        latitude: origin.latitude,
        longitude: origin.longitude,
      });
    }
  }, [origin]);  // Runs whenever the origin context updates

  useEffect(() => {
    if (destination?.latitude && destination?.longitude) {
      setUserDestination({
        latitude: destination.latitude,
        longitude: destination.longitude,
      });
    }
  }, [destination]);  // Runs whenever the destination context updates

  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  // Watch the driver's location using expo-location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const watchId = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 20000,  // Timeout in milliseconds
          distanceInterval: 1,  // Minimum change (in meters) betweens updates
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          setDriverLocation({
            latitude,
            longitude,
          });
        }
      );

      // Cleanup the watcher when the component unmounts
      return () => {
        watchId.remove();
      };
    })();
  }, []);

  // Animation state for Go Online button
  const [animationValue] = useState(new Animated.Value(1));
  const [isOnline, setIsOnline] = useState(false); // State to track if online

  // Animation state for Bell Icon
  const [bellAnimation] = useState(new Animated.Value(1));

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateBell = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnimation, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bellAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleGoOnline = () => {
    animateButton();
    setIsOnline(!isOnline); // Toggle online status
  };

  // Start bell animation on component mount
  useEffect(() => {
    animateBell();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.roundButton}
        >
          <Icon type="material-community" name="menu" color={colors.black} size={30} />
        </TouchableOpacity>
      </View>

      {/* Profile Picture */}
      <TouchableOpacity
        style={styles.profilePictureContainer}
        onPress={() => navigation.navigate('CustomerCommunicationBottomSheet')}
      >
        <Image
          source={require('../../assets/call.png')}
          style={styles.profilePicture}
        />
      </TouchableOpacity>

      {/* Map Component */}
      <MapComponent
        driverLocation={driverLocation}
        userOrigin={userOrigin}
        userDestination={userDestination}
      />

      {/* Go Online Button */}
      <Animated.View style={{ transform: [{ scale: animationValue }] }}>
        <TouchableOpacity style={styles.goOnlineButton} onPress={handleGoOnline}>
          <Text style={styles.goOnlineText}>{isOnline ? 'OFF' : 'GO'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bell Icon with Notifications */}
      <Animated.View style={[styles.bellContainer, { transform: [{ scale: bellAnimation }] }]}>
        <TouchableOpacity onPress={() => navigation.navigate('PendingTripsBottomSheet')}>
          <Icon name="bell" type="material-community" size={30} color="#007aff" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>2</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: parameters.statusBarHeight,
    backgroundColor: colors.white,
  },
  view1: {
    position: 'absolute',
    top: 25,
    left: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    zIndex: 10,
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 70,
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
  goOnlineButton: {
    position: 'absolute',
    bottom: 130, // Adjust as needed
    left: SCREEN_WIDTH / 2 - 30, // Center the button horizontally
    backgroundColor: '#007aff', // Button color
    borderRadius: 30, // Circular shape
    width: 60, // Diameter
    height: 60, // Diameter
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    elevation: 5, // Shadow effect for Android
  },
  goOnlineText: {
    color: '#fff', // Text color
    fontSize: 24, // Font size for "GO"
    fontWeight: 'bold', // Bold text
  },
  bellContainer: {
    position: 'absolute',
    top: 160,
    right: 20,
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
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