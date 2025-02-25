import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from '@expo/vector-icons';
import { images } from "../../assets/icons;";
const AboutScreen = ({ navigation }) => {
  const appVersion = "1.0.0"; // Update with your app version

  const openFacebook = () => {
    Linking.openURL("https://www.facebook.com/yourpage");
  };

  const rateApp = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.yourapp");
  };

  const openLegal = () => {
    Linking.openURL("https://www.yourapp.com/legal");
  };

  const openPrivacy = () => {
    Linking.openURL("https://www.yourapp.com/privacy");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About Us</Text>
      </View>

      <View style={styles.content}>
      <Image
        source={require('../../assets/icon.png')} // Correct usage for local images
        style={styles.logo}
      />
        <Text style={styles.introText}>
          Welcome to Nthome Rides! This platform is designed to provide a safe, efficient, and user-friendly experience for customers and drivers alike. Our mission is to connect people through seamless ride-sharing and ensure satisfaction for all users.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Version</Text>
          <Text style={styles.text}>Version: {appVersion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <TouchableOpacity style={styles.iconRow} onPress={rateApp}>
            <Icon name="star" size={24} color="#f4c542" />
            <Text style={styles.iconText}>Rate the App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconRow} onPress={openFacebook}>
            <Icon name="facebook" size={24} color="#3b5998" />
            <Text style={styles.iconText}>Like Us on Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconRow} onPress={openLegal}>
            <Icon name="file-document-outline" size={24} color="#555" />
            <Text style={styles.iconText}>Legal Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconRow} onPress={openPrivacy}>
            <Icon name="shield-lock-outline" size={24} color="#555" />
            <Text style={styles.iconText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 20,
    marginTop: 40,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#0dcaf0",  // Updated to the new color
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
    top:20,
    // left:10,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
    backgroundColor: "black",
    borderRadius: 50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "black",
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "#0dcaf0",  // Updated to the new color
    top: 20,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: "black",
    marginBottom: 30,
    textAlign: "center",
    top: 20,
  },
  section: {
    marginVertical: 16,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#045c5a",  // Updated to the new color
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});

export default AboutScreen;
