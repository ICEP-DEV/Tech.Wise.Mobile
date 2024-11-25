import React, { Component, useEffect, useRef } from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { mapStyle } from '../global/mapStyle';
import { colors, parameters } from '../global/styles'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_APIKEY } from "@env";



const MapComponent = ({ userOrigin, userDestination }) => {
    console.log("origin===and destintion",userOrigin, userDestination);
    
    const mapRef = useRef(null);
    useEffect(() => {
        if (userDestination?.latitude && userDestination?.longitude) {
            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.fitToCoordinates(
                        [userOrigin, userDestination],
                        {
                            edgePadding: {
                                top: 450,
                                right: 50,
                                left: 50,
                                bottom: 350,
                            },
                            animated: true,
                        }
                    );
                }
            });
        }
    }, [userOrigin, userDestination]);
    return (
        <View>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={mapStyle}
                ref={mapRef}
            >
                {userOrigin?.latitude && userOrigin?.longitude ? (
                    <Marker coordinate={userOrigin} anchor={{ x: 0.5, y: 0.5 }}>
                        <Image
                            source={require('../../assets/location.png')}
                            style={styles.markerOrigin2}
                            resizeMode="cover"
                        />
                    </Marker>
                ) : null}

                {userDestination?.latitude && userDestination?.longitude ? (
                    <Marker coordinate={userDestination} anchor={{ x: 0.5, y: 0.5 }}>
                        <Image
                            source={require('../../assets/location.png')}
                            style={styles.markerDestination}
                            resizeMode="cover"
                        />
                    </Marker>
                ) : null}
                   {userDestination.latitude !== null &&
                        <MapViewDirections 
                          origin={userOrigin}
                          destination={userDestination}
                          apikey={GOOGLE_MAPS_APIKEY}
                          strokeWidth={4}
                          strokeColor={colors.black}
                        />
                    } 
            </MapView>
        </View >
    )
}

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
    }
})