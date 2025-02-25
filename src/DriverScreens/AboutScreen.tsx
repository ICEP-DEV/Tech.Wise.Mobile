import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package or use your preferred icon library

const AboutScreen = ({ navigation }) => {
  const appVersion = "1.0.0"; // Update with your app version

  const openFacebook = () => {
    // Replace with your Facebook page URL
    Linking.openURL("https://www.facebook.com/yourpage");
  };

  const rateApp = () => {
    // Replace with your App Store/Play Store link
    Linking.openURL("https://play.google.com/store/apps/details?id=com.yourapp");
  };

  const openLegal = () => {
    // Replace with your legal information URL
    Linking.openURL("https://www.yourapp.com/legal");
  };

  const openPrivacy = () => {
    // Replace with your privacy policy URL
    Linking.openURL("https://www.yourapp.com/privacy");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, top: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navigate to the previous screen
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 30, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          About Us
        </Text>
        
      </View>
      
<View style={{  top: 30 }}>
      <Text style={styles.text}>
        Welcome to Nthome Rides! This platform is designed to provide a safe, efficient, and user-friendly experience for customers and drivers alike. Our mission is to connect people through seamless ride-sharing and ensure satisfaction for all users.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Version</Text>
        <Text style={styles.text}>Version: {appVersion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        {/* Rate the App */}
        <TouchableOpacity style={styles.iconRow} onPress={rateApp}>
          <Icon name="star" size={24} color="#f4c542" />
          <Text style={styles.iconText}>Rate the App</Text>
        </TouchableOpacity>

        {/* Like Us on Facebook */}
        <TouchableOpacity style={styles.iconRow} onPress={openFacebook}>
          <Icon name="facebook" size={24} color="#3b5998" />
          <Text style={styles.iconText}>Like Us on Facebook</Text>
        </TouchableOpacity>

        {/* Legal */}
        <TouchableOpacity style={styles.iconRow} onPress={openLegal}>
          <Icon name="file-document-outline" size={24} color="#555" />
          <Text style={styles.iconText}>Legal Information</Text>
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity style={styles.iconRow} onPress={openPrivacy}>
          <Icon name="shield-lock-outline" size={24} color="#555" />
          <Text style={styles.iconText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/icon.png')} // Correct usage for local images
        style={styles.logo}
      />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60, // This makes the image circular
    alignSelf: 'center', // Centers the logo horizontally
    marginBottom: 20, // Space between the logo and the bottom of the screen
    marginTop: 20, // Adds some space above the logo
  }
  ,
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    marginBottom: 16,
    textAlign: "justify",
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#555",
  },
});

export default AboutScreen;
