import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Import DrawerNavigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import BottomTabNavigator
import { Icon } from 'react-native-elements'; // Assuming you're using this for icons
import HomeScreen from '../screens/HomeScreen';
import RequestScreen from '../screens/RequestScreen';
import DestinationScreen from '../screens/DestinationScreen'; // Make sure this is the correct import

const Stack = createNativeStackNavigator(); // Renaming to `Stack` for better clarity
const Drawer = createDrawerNavigator(); // Create DrawerNavigator
const Tab = createBottomTabNavigator(); // Create BottomTabNavigator

// Bottom Tab Navigator for navigating between screens
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Disable header for all tab screens
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="home"
              type="material-community"
              size={size}
              color={focused ? '#7cc' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Request"
        component={RequestScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="car"
              type="material-community"
              size={size}
              color={focused ? '#7cc' : 'gray'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Destination"
        component={DestinationScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="map"
              type="material-community"
              size={size}
              color={focused ? '#7cc' : 'gray'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigator function to wrap HomeScreen with the drawer
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false, // Disable header for the drawer screens
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={BottomTabNavigator} // Replace HomeScreen with BottomTabNavigator here
        options={{
          drawerIcon: ({ focused, size }) => (
            <Icon name="home" type="material-community" size={size} color={focused ? '#7cc' : 'gray'} />
          ),
        }}
      />
      {/* Add other screens to the drawer as needed */}
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
     <Stack.Screen
          name="DrawerNavigator" // Use this name for the DrawerNavigator
          component={DrawerNavigator} // Use DrawerNavigator here
          options={{ headerShown: false }} // Disable header for the entire drawer
        />
        <Stack.Screen
          name="RequestScreen"
          component={RequestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DestinationScreen"
          component={DestinationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
