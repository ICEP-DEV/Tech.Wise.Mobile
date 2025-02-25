// import * as React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { Icon } from "react-native-elements";
// import { colors } from "../global/styles"; // Ensure this path is correct
// import HomeScreen from './customerscreens/HomeScreen'; // Adjust the path based on your project structure
// import PendingRequests from '../DriverScreens/PendingRequests'; // Add other screens as necessary
// import LoginScreen from '../WelcomeScreens/LoginScreen';
// import HomeStack from './StackNavigation'; // Corrected to HomeStack
// const Drawer = createDrawerNavigator();

// export default function DrawerNavigator() {
//     return (
//         <Drawer.Navigator 
//             initialRouteName="LoginScreen"
//             drawerContent={props => <HomeStack {...props} />} // Ensure HomStack is defined and imported correctly
//         >
            
//             <Drawer.Screen
//                 name="LoginScreen"
//                 component={LoginScreen}
//                 options={{
//                     title: "LoginScreen",
//                     drawerIcon: ({ focused, size }) => (
//                         <Icon
//                             type="material-community"
//                             name="LoginScreen"
//                             color={focused ? '#7cc' : colors.grey2}
//                             size={size}
//                         />
//                     ),
//                     headerShown: false, // This will hide the header for this screen
//                 }}
//             />
            
  
//         </Drawer.Navigator>
//     );
// }
