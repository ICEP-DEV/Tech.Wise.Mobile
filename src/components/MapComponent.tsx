"use client"

import { useEffect, useRef, useState } from "react"
import { View, StyleSheet, Image, Text, Animated, Easing, TouchableOpacity } from "react-native"
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { darkMapStyle } from "../global/mapStyle"
import { GOOGLE_MAPS_APIKEY } from "@env"
import { Icon } from "react-native-elements"

// Define theme colors
const THEME = {
  background: "#121212",
  card: "#1E1E1E",
  primary: "#00D8F0", // Bright cyan
  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
  },
}

const MapComponent = ({ userOrigin, userDestination, driverLocation }) => {
  const mapRef = useRef(null)
  const [mapBearing, setMapBearing] = useState(0)
  const [instructions, setInstructions] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const rotateAnimatedValue = useRef(new Animated.Value(0)).current

  // Start rotation animation for driver marker
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnimatedValue, {
        toValue: 360,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  useEffect(() => {
    if (userOrigin?.latitude && userDestination?.latitude && driverLocation?.latitude) {
      const coordinates = [userOrigin, userDestination, driverLocation].filter(
        (coord) => coord?.latitude && coord?.longitude,
      )
      if (coordinates.length > 0 && mapRef.current) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 50,
            right: 50,
            left: 50,
            bottom: 50,
          },
          animated: true,
        })
      }
    }
  }, [userOrigin, userDestination, driverLocation])

  useEffect(() => {
    if (driverLocation?.latitude && driverLocation?.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
    }
  }, [driverLocation])

  const handleDirectionsReady = (result) => {
    if (result.distance > 0 && result.duration > 0) {
      setDistance(result.distance.toFixed(2))
      setDuration(result.duration.toFixed(2))
    }
    if (result.legs && result.legs[0] && result.legs[0].steps) {
      setInstructions(result.legs[0].steps)
    }
  }

  const centerOnCurrentLocation = () => {
    if (driverLocation?.latitude && driverLocation?.longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
    }
  }

  const initialRegion =
    driverLocation?.latitude && driverLocation?.longitude
      ? {
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : {
          latitude: -25.5399,
          longitude: 28.1,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        initialRegion={initialRegion}
        showsUserLocation={false}
        followsUserLocation={true}
        customMapStyle={darkMapStyle}
        showsMyLocationButton={false} // <--- THIS disables the butto
      >
        {driverLocation?.latitude && driverLocation?.longitude && (
          <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }} rotation={mapBearing}>
            <Animated.View
              style={[
                styles.driverMarkerContainer,
                {
                  transform: [
                    {
                      rotate: rotateAnimatedValue.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image source={require("../../assets/carM.png")} style={styles.driverMarkerImage} resizeMode="contain" />
            </Animated.View>
          </Marker>
        )}

        {userOrigin?.latitude && userOrigin?.longitude && (
          <Marker coordinate={userOrigin}>
            <View style={styles.originMarker}>
              <Icon type="material-community" name="map-marker" color={THEME.primary} size={30} />
            </View>
          </Marker>
        )}

        {/* Directions from Driver Location to User Pickup */}
        {driverLocation?.latitude && userOrigin?.latitude && (
          <MapViewDirections
            origin={driverLocation}
            destination={userOrigin}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor={THEME.primary}
            onReady={handleDirectionsReady}
            onError={(error) => console.error("Directions Error:", error)}
          />
        )}
      </MapView>

      {/* Trip Details Card */}
      {distance && duration && (
        <View style={styles.tripDetailsCard}>
          <View style={styles.tripDetailsHeader}>
            <Icon type="material-community" name="map-marker-path" color={THEME.primary} size={20} />
            <Text style={styles.tripDetailsTitle}>Trip Details</Text>
          </View>

          <View style={styles.tripDetailsContent}>
            <View style={styles.tripDetailSection}>
              <Icon type="material-community" name="map-marker-distance" color={THEME.primary} size={24} />
              <View style={styles.tripDetailValue}>
                <Text style={styles.tripDetailValueText}>{distance} km</Text>
                <Text style={styles.tripDetailLabel}>Distance</Text>
              </View>
            </View>

            <View style={styles.tripDetailDivider} />

            <View style={styles.tripDetailSection}>
              <Icon type="material-community" name="clock-outline" color={THEME.primary} size={24} />
              <View style={styles.tripDetailValue}>
                <Text style={styles.tripDetailValueText}>{duration} min</Text>
                <Text style={styles.tripDetailLabel}>ETA</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Navigation Card */}
      <View style={styles.navigationCard}>
        <View style={styles.navigationHeader}>
          <Icon type="material-community" name="navigation" color={THEME.primary} size={20} />
          <Text style={styles.navigationTitle}>Navigation</Text>
        </View>

        <View style={styles.navigationContent}>
          {instructions.length > 0 && currentStep < instructions.length ? (
            <Text style={styles.navigationText}>
              {instructions[currentStep].html_instructions.replace(/<[^>]+>/g, "")}
            </Text>
          ) : (
            <Text style={styles.navigationText}>Head to destination</Text>
          )}
        </View>

        <TouchableOpacity style={styles.locationButton} onPress={centerOnCurrentLocation}>
          <Icon type="material-community" name="crosshairs-gps" color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MapComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "100%",
    width: "100%",
  },
  driverMarkerContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0, 216, 240, 0.3)",
    borderWidth: 2,
    borderColor: "#00D8F0",
  },
  driverMarkerImage: {
    width: 25,
    height: 25,
    tintColor: "#FFFFFF",
  },
  originMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  tripDetailsCard: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 216, 240, 0.3)",
    overflow: "hidden",
    width: "80%",
  },
  tripDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tripDetailsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  tripDetailsContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  tripDetailSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tripDetailValue: {
    marginLeft: 12,
    alignItems: "flex-start",
  },
  tripDetailValueText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  tripDetailLabel: {
    color: "#AAAAAA",
    fontSize: 14,
  },
  tripDetailDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 8,
  },
  navigationCard: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 216, 240, 0.3)",
    overflow: "hidden",
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  navigationTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  navigationContent: {
    padding: 16,
  },
  navigationText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  locationButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})
