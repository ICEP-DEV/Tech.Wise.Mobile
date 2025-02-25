import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { mapStyle } from '../global/mapStyle';
import { colors } from '../global/styles';
import { GOOGLE_MAPS_APIKEY } from "@env";

const MapComponent = ({ userOrigin, userDestination, driverLocation }) => {
    const mapRef = useRef(null);
    const [instructions, setInstructions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (userOrigin?.latitude && userDestination?.latitude && driverLocation?.latitude) {
            const coordinates = [userOrigin, userDestination, driverLocation].filter(
                (coord) => coord?.latitude && coord?.longitude
            );
            if (coordinates.length > 0 && mapRef.current) {
                mapRef.current.fitToCoordinates(coordinates, {
                    edgePadding: {
                        top: 50,
                        right: 50,
                        left: 50,
                        bottom: 50,
                    },
                    animated: true,
                });
            }
        }
    }, [userOrigin, userDestination, driverLocation]);

    useEffect(() => {
        if (driverLocation?.latitude && driverLocation?.longitude && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    }, [driverLocation]);

    const handleDirectionsReady = (result) => {
        setInstructions(result.legs[0].steps); // Extract steps from directions
        console.log('Distance:', result.distance);
        console.log('Duration:', result.duration);
    };

    const initialRegion = driverLocation?.latitude && driverLocation?.longitude
        ? {
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }
        : {
            latitude: -25.5399,
            longitude: 28.1000,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={mapStyle}
                ref={mapRef}
                initialRegion={initialRegion}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {userOrigin?.latitude && userOrigin?.longitude && (
                    <Marker coordinate={userOrigin} anchor={{ x: 0.5, y: 0.5 }}>
                        <Image
                            source={require('../../assets/location.png')}
                            style={styles.markerOrigin}
                            resizeMode="cover"
                        />
                    </Marker>
                )}

                {userDestination?.latitude && userDestination?.longitude && (
                    <Marker coordinate={userDestination} anchor={{ x: 0.5, y: 0.5 }}>
                        <Image
                            source={require('../../assets/location.png')}
                            style={styles.markerDestination}
                            resizeMode="cover"
                        />
                    </Marker>
                )}

                {driverLocation?.latitude && driverLocation?.longitude && (
                    <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
                        <Image
                            source={require('../../assets/carMarker.png')}
                            style={styles.markerDriver}
                            resizeMode="cover"
                        />
                    </Marker>
                )}

                {/* Directions from Driver Location to User Origin */}
                {driverLocation?.latitude && userOrigin?.latitude && (
                    <MapViewDirections
                        origin={driverLocation}
                        destination={userOrigin}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={4}
                        strokeColor={colors.black}
                        onReady={(result) => {
                            handleDirectionsReady(result);
                        }}
                        onError={(error) => console.error("Directions Error:", error)}
                    />
                )}

                {/* Directions from User Origin to User Destination */}
                {userOrigin?.latitude && userDestination?.latitude && (
                    <MapViewDirections
                        origin={userOrigin}
                        destination={userDestination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={4}
                        strokeColor={colors.black}
                        onReady={(result) => {
                            handleDirectionsReady(result);
                        }}
                        onError={(error) => console.error("Directions Error:", error)}
                    />
                )}
            </MapView>

            {/* Display Turn Instructions */}
            <View style={styles.instructionsContainer}>
                {instructions.length > 0 && currentStep < instructions.length ? (
                    <Text style={styles.instructionText}>
                        {instructions[currentStep].html_instructions.replace(/<[^>]+>/g, '')} {/* Remove HTML tags */}
                    </Text>
                ) : (
                    <Text style={styles.instructionText}>Arrived at your destination!</Text>
                )}
            </View>
        </View>
    );
};

export default MapComponent;
const styles = StyleSheet.create({
    map: {
        height: "100%",
        width: "100%"
    },


    markerWrapOrigin: {
        //  alignItems: "center",
        // justifyContent: "center",
        width: 40,
        height: 20,
        // marginTop:0
    },
    markerOrigin: {
        width: 16,
        height: 16,
        borderRadius: 8
    },

    destination: {
        width: 20,
        height: 20,
        backgroundColor: colors.black,
        alignItems: "center",
        justifyContent: "center"
    },

    view1: {
        width: 7,
        height: 7,
        backgroundColor: colors.white
    },
    markerDestination: {
        width: 16,
        height: 16,

    },

    markerOrigin2: {
        width: 20,
        height: 20,
        borderRadius: 10
    },
    markerDriver: {
        width: 40,
        height: 20,
    },
    car: {
        paddingTop: 0,
        width: 40,
        height: 20,
    },

    view2: {
        position: "absolute",
        top: 10,
        right: 12,
        backgroundColor: colors.white,
        height: 40,
        width: 180,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
        zIndex: 8

    },

    view3: {
        flexDirection: "row",
        alignItems: "center",
        //marginRight:15,
        //backgroundColor:"white",
        //paddingHorizontal:2,
        paddingVertical: 2,
        //borderRadius:20
    },

    view4: {
        position: "absolute",
        top: 50,
        left: 12,
        backgroundColor: colors.white,
        height: 40,
        width: 140,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
        zIndex: 8

    },

    location: {
        width: 20,
        height: 20,
        borderRadius: 9,
        backgroundColor: colors.black,
        alignItems: "center",
        justifyContent: "center"

    },

    view9: {
        width: 6,
        height: 6,
        borderRadius: 4,
        backgroundColor: "white"
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 60,
        left: '5%',
        right: '5%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    instructionText: {
        fontSize: 15,
        color: colors.black,
    },
})