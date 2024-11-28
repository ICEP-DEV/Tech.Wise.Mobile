import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapComponent from '../components/MapComponent';
import { colors,parameters } from '../global/styles'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { DestinationContext, OriginContext } from '../contexts/contexts';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements';
import { rideData } from '../global/data';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RequestScreen({ navigation }) {
  const { origin, dispatchOrigin } = useContext(OriginContext);
  const { destination, dispatchDestination } = useContext(DestinationContext);

  const [userOrigin, setUserOrigin] = useState({
    latitude: origin?.latitude || 0,
    longitude: origin?.longitude || 0,
  });
  // const [userDestination, setUserDestination] = useState({
  //   latitude: destination?.latitude || 0,
  //   longitude: destination?.longitude || 0,
  // });

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      if (coords) {
        const { latitude, longitude } = coords;
        setUserOrigin({ latitude, longitude });
        dispatchOrigin({ type: 'ADD_ORIGIN', payload: { latitude, longitude } });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    if (
      userOrigin?.latitude !== 0 &&
      userOrigin?.longitude !== 0 &&
      destination &&
      destination.latitude !== null &&
      destination.longitude !== null
    ) {
      navigation.navigate('CarListingBottomSheet');
    }
  }, [userOrigin, destination]);

  const handleNavigation = () => {
    if (destination &&
      destination.latitude !== null &&
      destination.longitude !== null) {
      navigation.navigate('CarListingBottomSheet'); // Navigate to CarListing if destination is entered
    } else {
      navigation.navigate('RecentPlacesBottomSheet'); // Navigate to RecentPlaces if destination is not entered
    }
  };




  // const handleDestinationSelect = (data, details) => {
  //   const { lat, lng } = details.geometry.location;
  //   setUserDestination({ latitude: lat, longitude: lng });
  //   dispatchDestination({ type: 'ADD_DESTINATION', payload: { latitude: lat, longitude: lng } });
  //   // navigation.navigate("RequestScreen",{state:0})
  // };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <>
      <View style={styles.container}>
      <View style ={styles.view1}> 
                <Icon 
                    type ="material-community"
                    name ="arrow-left"
                    color ={colors.grey1}
                    size ={32} 
                    onPress ={() => navigation.goBack()}
                />
            </View>

        <View style={[styles.inputContainer, autoCompleteStyles.inputStackContainer]}>
          <GooglePlacesAutocomplete
            placeholder="Where to"
            listViewDisplayed="auto"
            debounce={400}
            minLength={2}
            enablePoweredByContainer={false}
            fetchDetails={true}
            autoFocus={true}
            onPress={(data, details = null) => {
              if (details) {
                dispatchDestination({
                  type: "ADD_DESTINATION",
                  payload: {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    address: details.formatted_address,
                    name: details.name,
                  },
                });
              } else {
                console.error("Google Places did not return 'details'");
              }
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            styles={autoCompleteStyles}
          />

        </View>


        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => handleNavigation()}
        >
          <Icon type="material-community" name="arrow-up" size={30} color="white" />
        </TouchableOpacity>

        <MapComponent userOrigin={userOrigin} userDestination={destination} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container1:{flex:1,
    paddingTop:parameters.statusBarHeight,
    
},

container: {
    flex: 1,
    paddingTop:parameters.statusBarHeight
   
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
   
  },
  backButton: {
    padding: 10,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestText: {
    fontSize: 18,
    color: colors.grey1,
    marginLeft: 8, // Adds spacing between the icon and the text
    fontWeight: 'bold', // Makes the text bold
  },
  inputContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  arrowButton: {
    backgroundColor: '#6200ee', // Deep purple button
    borderRadius: 30,          // Circle shape
    width: 60,                 // Diameter
    height: 60,                // Diameter
    justifyContent: 'center',  // Center icon vertically
    alignItems: 'center',      // Center icon horizontally
    position: 'absolute',      // Absolute positioning
    bottom: 20,                // Distance from the bottom
    right: 20,                 // Distance from the right
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.3,        // Shadow transparency
    shadowRadius: 4,           // Shadow radius
    elevation: 5,
    zIndex: 1,              // Elevation for Android shadow
  },
  view1:{
    position:"absolute",
    top:25,
    left:12,
    backgroundColor:colors.white,
    height:40,
    width:40,
    borderRadius:20,
    justifyContent:"center",
    alignItems:"center",
    marginTop:2, 
    zIndex: 8
    
  },

  view2:{
    height:SCREEN_HEIGHT*0.21,
    alignItems:"center",
    zIndex: 5,
    backgroundColor:colors.white
  },

});

const autoCompleteStyles = {
  container: {
    flex: 0,
    marginBottom: 10,
  },
  textInputContainer: {
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  textInput: {
    height: 40,
    color: "#5d5d5d",
    fontSize: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
  },
  listView: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 5,
    elevation: 3,
  },
  inputStackContainer: {
    marginTop: 65,
  },
};
