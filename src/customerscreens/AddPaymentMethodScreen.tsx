import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Button } from "react-native-elements";

const AddPaymentMethodScreen = ({ navigation }) => {
  const [methodType, setMethodType] = useState("Credit Card");
  const [details, setDetails] = useState("");

  const handleSave = () => {
    // Save logic here, e.g., add to database or state
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      <Picker
        selectedValue={methodType}
        onValueChange={(itemValue) => setMethodType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Credit Card" value="Credit Card" />
        <Picker.Item label="PayPal" value="PayPal" />
        <Picker.Item label="Apple Pay" value="Apple Pay" />
        <Picker.Item label="Cash" value="Cash" />
      </Picker>
      {methodType !== "Cash" && (
        <TextInput
          style={styles.input}
          placeholder={
            methodType === "Credit Card"
              ? "Card Number"
              : methodType === "PayPal"
              ? "PayPal Email"
              : "Apple Pay Details"
          }
          value={details}
          onChangeText={setDetails}
        />
      )}
      <Button title="Save" onPress={handleSave} buttonStyle={styles.saveButton} />
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#7cc",
  },
});

export default AddPaymentMethodScreen;