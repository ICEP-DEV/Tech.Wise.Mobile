import React, { useContext, useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapComponent from '../components/MapComponent';
import { colors } from '../global/styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { DestinationContext, OriginContext } from '../contexts/contexts';
import * as Location from 'expo-location';
import { SavedPlacesBottomSheet } from '../components/SavedPlacesBottomSheet';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function RequestScreen({ navigation }) {
  const { origin, dispatchOrigin } = useContext(OriginContext);
  const { destination, dispatchDestination } = useContext(DestinationContext);

  const [userOrigin, setUserOrigin] = useState({
    latitude: origin?.latitude || 0,
    longitude: origin?.longitude || 0,
  });
  const [userDestination, setUserDestination] = useState({
    latitude: destination?.latitude || 0,
    longitude: destination?.longitude || 0,
  });

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
        dispatchOrigin({ type: 'SET_ORIGIN', payload: { latitude, longitude } });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleDestinationSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    setUserDestination({ latitude: lat, longitude: lng });
    dispatchDestination({ type: 'SET_DESTINATION', payload: { latitude: lat, longitude: lng } });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
 

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.view1}>
          <Text>Back</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.inputContainer, autoCompleteStyles.inputStackContainer]}>
        {/* WHERE TO */}
        <GooglePlacesAutocomplete
          placeholder="Where to"
          listViewDisplayed="auto"
          debounce={400}
          minLength={2}
          enablePoweredByContainer={false}
          fetchDetails={true}
          autoFocus={true}
          onPress={handleDestinationSelect}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
          styles={autoCompleteStyles}
        />
      </View>

      <MapComponent userOrigin={userOrigin} userDestination={userDestination} />
    
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
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
    marginTop: 50,
  },
};
