import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package or use your preferred icon library

const SupportScreen = ({navigation}) => {
  const handleEmailSupport = () => {
    const email = "support@example.com"; // Replace with your support email
    const subject = "Support Request";
    const body = "Hi, I need help with...";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Failed to open email client:", err)
    );
  };

  const handleCallSupport = () => {
    const phone = "123456789"; // Replace with your support phone number
    Linking.openURL(`tel:${phone}`).catch((err) =>
      console.error("Failed to open phone dialer:", err)
    );
  };

  const handleLiveChat = () => {
    const chatUrl = "https://example.com/live-chat"; // Replace with your live chat URL
    Linking.openURL(chatUrl).catch((err) =>
      console.error("Failed to open live chat:", err)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()} // Navigate to the previous screen
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 30, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
          Support Center
        </Text>
      </View>
      <Text style={styles.subtitle}>We’re here to help you!</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option} onPress={handleEmailSupport}>
          <MaterialIcons name="email" size={28} color="#007bff" />
          <Text style={styles.optionText}>Email Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleCallSupport}>
          <FontAwesome name="phone" size={28} color="#28a745" />
          <Text style={styles.optionText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLiveChat}>
          <MaterialIcons name="chat" size={28} color="#17a2b8" />
          <Text style={styles.optionText}>Live Chat</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
      <View style={styles.faq}>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Q: How do I reset my password?</Text>
          <Text style={styles.faqAnswer}>
            A: Go to the login screen, click "Forgot Password," and follow the instructions.
          </Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            Q: How do I update my payment method?
          </Text>
          <Text style={styles.faqAnswer}>
            A: Navigate to the "Payment Settings" in your profile and update your details.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
    color: "#333",
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  faq: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  faqAnswer: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});

export default SupportScreen;
