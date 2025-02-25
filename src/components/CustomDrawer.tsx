import React, { useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from 'react-redux';
import { Rating } from 'react-native-ratings'; // Import Rating component

interface CustomDrawerProps {
    isOpen: boolean;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, toggleDrawer, navigation }) => {
    const user = useSelector(state => state.auth.user);
    const drawerWidth = 280;
    const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;

    const animateDrawer = useCallback(() => {
        Animated.timing(slideAnim, {
            toValue: isOpen ? 0 : -drawerWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOpen, slideAnim]);

    useEffect(() => {
        animateDrawer();
    }, [isOpen, animateDrawer]);

    return (
        <>
            {isOpen && (
                <Pressable style={styles.overlay} onPress={toggleDrawer}>
                    <View style={styles.overlayInner} />
                </Pressable>
            )}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <View style={styles.drawerContent}>
                    {/* Display customer's name and rating at the top */}
                    <View style={[styles.menuItem, styles.mainMenuItem]}>
                        <Icon name="user" size={20} color="#666666" />
                        <View>
                            <Text style={styles.mainText}>
                                {user ? `Hello, ${user.name}` : "Loading..."}
                            </Text>
                            <Text style={styles.ratingText}>
                                4.8 {/* Hardcoded dummy rating */}
                            </Text>
                        </View>
                    </View>


                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Icon name="user" size={20} color="#666666" />
                        <Text style={styles.menuText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('About')}
                    >
                        <Icon name="user" size={20} color="#666666" />
                        <Text style={styles.menuText}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Support')}
                    >
                        <Icon name="user" size={20} color="#666666" />
                        <Text style={styles.menuText}>Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('LogoutPage')}
                    >
                        <Icon name="log-out" size={20} color="#666666" />
                        <Text style={styles.menuText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    overlayInner: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    drawer: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 350,
        backgroundColor: "#fff",
        zIndex: 101,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    drawerContent: {
        flex: 1,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        paddingHorizontal: 24,
        gap: 12,
    },
    mainMenuItem: {
        backgroundColor: "#EBF5FF",
        marginBottom: 4,
        borderRadius: 24,
    },
    menuText: {
        fontSize: 16,
        color: "#666666",
        fontWeight: "400",
    },
    mainText: {
        fontSize: 16,
        color: "#2196F3",
        fontWeight: "400",
    },
    rating: {
        marginTop: 8,
    },
    ratingText: {
        marginTop: 8,
        fontSize: 14,
        color: "#666666",
        fontWeight: "400",
      },
      
});

export default CustomDrawer;
