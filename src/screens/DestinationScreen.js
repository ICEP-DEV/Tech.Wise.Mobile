import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors, parameters } from '../global/styles';
import { DestinationContext, OriginContext } from '../contexts/contexts';
import MapComponent from '../components/MapComponent';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const DestinationScreen = ({ navigation, route }) => {
  const { origin } = useContext(OriginContext);
  const { destination } = useContext(DestinationContext);

  const [userOrigin, setUserOrigin] = useState({
    latitude: origin?.latitude || 0,
    longitude: origin?.longitude || 0,
  });

  const [userDestination, setUserDestination] = useState({
    latitude: destination?.latitude || 0,
    longitude: destination?.longitude || 0,
  });

  // Update local states when origin or destination context changes
  useEffect(() => {
    if (origin?.latitude && origin?.longitude) {
      setUserOrigin({ latitude: origin.latitude, longitude: origin.longitude });
    }

    if (destination?.latitude && destination?.longitude) {
      setUserDestination({
        latitude: destination.latitude,
        longitude: destination.longitude,
      });
    }
  }, [origin, destination]);

  // Debug logs for tracking updates
  useEffect(() => {
    console.log("Origin Context Updated:", origin);
    console.log("Destination Context Updated:", destination);
  }, [origin, destination]);

  return (
    <View style={styles.view2}>
      <View style={styles.view1}>
        <Icon
          type="material-community"
          name="arrow-left"
          size={32}
          color={colors.grey1}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text>Destination</Text>
      {/* Pass userOrigin and userDestination to MapComponent */}
      <MapComponent userOrigin={userOrigin} userDestination={userDestination} />
    </View>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: parameters.statusBarHeight
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
    marginTop: 2,
    zIndex: 10

  },

  view3: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 10,
    backgroundColor: colors.white,
    height: 30,
    zIndex: 10
  },

  view2: {
    backgroundColor: colors.white,
    zIndex: 4,
    paddingBottom: 10,

  },

  view24: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingHorizontal: 20
  },

  view25: {
    flexDirection: 'row',
    alignItems: "baseline"
  },

  flatlist: {
    marginTop: 20,
    zIndex: 17,
    elevation: 8
  },

});


const autoComplete = {

  textInput: {
    backgroundColor: colors.grey6,
    height: 50,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 15,
  },
  container: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: colors.white
  },

  textInputContainer: {
    flexDirection: 'row',
  },

}
