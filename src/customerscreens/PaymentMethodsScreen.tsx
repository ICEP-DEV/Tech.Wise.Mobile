import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Icon, Button } from "react-native-elements";

const PaymentMethodsScreen = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "1", type: "Credit Card", details: "**** **** **** 1234" },
    { id: "2", type: "PayPal", details: "user@example.com" },
    { id: "3", type: "Apple Pay", details: "Linked to iPhone" },
    { id: "4", type: "Cash", details: "Pay in-person" },
  ]);

  const handleAddPaymentMethod = () => {
    navigation.navigate("AddPaymentMethod");
  };

  const handleRemoveMethod = (id) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.filter((method) => method.id !== id)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Methods</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentCard}>
            <Icon
              name={
                item.type === "Credit Card"
                  ? "credit-card"
                  : item.type === "PayPal"
                  ? "paypal"
                  : item.type === "Apple Pay"
                  ? "apple"
                  : "cash-multiple"
              }
              type="material-community"
              size={30}
              color="#7cc"
            />
            <View style={styles.paymentDetails}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.details}>{item.details}</Text>
            </View>
            {item.type !== "Cash" && (
              <TouchableOpacity onPress={() => handleRemoveMethod(item.id)}>
                <Icon name="" type="material" size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <Button
        title="Add Payment Method"
        onPress={handleAddPaymentMethod}
        buttonStyle={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  type: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "gray",
  },
  addButton: {
    marginTop: 20,
    backgroundColor: "#7cc",
  },
});

export default PaymentMethodsScreen;
