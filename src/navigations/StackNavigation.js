import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../customerscreens/HomeScreen'
import RequestScreen from '../customerscreens/RequestScreen';
import DestinationScreen from '../customerscreens/DestinationScreen';
import RecentPlacesBottomSheet from '../components/RecentPlacesBottomSheet';
import CarListingBottomSheet from '../components/CarListingBottomSheet';
import DriverDetailsBottomSheet from '../components/DriverDetailsBottomSheet';
// driver stackNavigator
import PendingTripsBottomSheet from '../DriverComponents/PendingTripsBottomSheet';

const Home = createNativeStackNavigator();

export function HomeStack() {
    return (
        <Home.Navigator>
            <Home.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Home.Screen
                name="RequestScreen"
                component={RequestScreen}
                options={{ headerShown: false }}
            />
            <Home.Screen
                name="DestinationScreen"
                component={DestinationScreen}
                options={{ headerShown: false }}
            />
            <Home.Screen
                name="RecentPlacesBottomSheet"
                component={RecentPlacesBottomSheet}
                options={{
                    headerShown: false
                }}
            />
            <Home.Screen
                name="CarListingBottomSheet"
                component={CarListingBottomSheet}
                options={{
                    headerShown: false
                }}
            />
            <Home.Screen
                name="CarListingBottomSheet"
                component={CarListingBottomSheet}
                options={{
                    headerShown: false
                }}
            />
            <Home.Screen
                name="DriverDetailsBottomSheet "
                component={DriverDetailsBottomSheet}
                options={{
                    headerShown: false
                }}
            />
                <Home.Screen
                name="PendingTripsBottomSheet "
                component={PendingTripsBottomSheet}
                options={{
                    headerShown: false
                }}
            />
        </Home.Navigator>
    )
}