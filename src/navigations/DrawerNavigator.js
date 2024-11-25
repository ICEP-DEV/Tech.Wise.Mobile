import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "react-native-elements";
import { colors } from "../global/styles"; // Ensure this path is correct
import HomeScreen from './screens/HomeScreen'; // Adjust the path based on your project structure
import ProfileScreen from './screens/ProfileScreen'; // Add other screens as necessary

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator 
            initialRouteName="Home"
            drawerContent={props => <HomStack {...props} />} // Ensure HomStack is defined and imported correctly
        >
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Home",
                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            type="material-community"
                            name="home"
                            color={focused ? '#7cc' : colors.grey2}
                            size={size}
                        />
                    ),
                    headerShown: false, // This will hide the header for this screen
                }}
            />
            <Drawer.Screen
                name="Profile" // Example additional screen
                component={ProfileScreen}
                options={{
                    title: "Profile",
                    drawerIcon: ({ focused, size }) => (
                        <Icon
                            type="material-community"
                            name="account"
                            color={focused ? '#7cc' : colors.grey2}
                            size={size}
                        />
                    ),
                    headerShown: false,
                }}
            />
        </Drawer.Navigator>
    );
}
