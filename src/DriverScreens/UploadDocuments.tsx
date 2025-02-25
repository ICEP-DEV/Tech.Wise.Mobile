import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; 
import { Ionicons } from '@expo/vector-icons';

const UploadDocuments = ({ navigation }) => {
  const [documents, setDocuments] = useState({
    pdpLicense: null,
    id: null,
    policeClearance: null,
    driverLicense: null,
    inspectionReport: null,
  });

  // Handle PDF upload
  const handlePdfUpload = async (field) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Restrict to PDF files
      });

      if (result.canceled) {
        Alert.alert("Attachment Canceled", "No file was selected.");
        return;
      }

      const { name, mimeType, uri } = result.assets[0];

      if (mimeType !== "application/pdf") {
        Alert.alert("Invalid File", "Please attach a valid PDF document.");
        return;
      }

      setDocuments((prev) => ({
        ...prev,
        [field]: {
          uri,
          name,
        },
      }));

      Alert.alert("Success", `${name} attached successfully.`);
    } catch (error) {
      Alert.alert("Error", "Something went wrong while selecting the file.");
      console.error(error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (
      !documents.pdpLicense ||
      !documents.id ||
      !documents.policeClearance ||
      !documents.driverLicense ||
      !documents.inspectionReport
    ) {
      Alert.alert("Missing Documents", "Please attach all required documents before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('gender', 'Male'); // Example gender value
    formData.append('userId', '123'); // Example user ID value
    formData.append('payment_url', 'http://payment-url'); // Example payment URL

    formData.append('id_copy', {
      uri: documents.id.uri,
      type: 'application/pdf',
      name: documents.id.name,
    });

    formData.append('police_clearance', {
      uri: documents.policeClearance.uri,
      type: 'application/pdf',
      name: documents.policeClearance.name,
    });

    formData.append('pdp', {
      uri: documents.pdpLicense.uri,
      type: 'application/pdf',
      name: documents.pdpLicense.name,
    });

    formData.append('car_inspection', {
      uri: documents.inspectionReport.uri,
      type: 'application/pdf',
      name: documents.inspectionReport.name,
    });

    // Send the data to the backend
    try {
      const response = await fetch('http://localhost:5000/mobile/driver_details', {
        method: 'POST',
        body: formData,
      });
      const responseJson = await response.json();
      if (responseJson.message) {
        Alert.alert("Success", "Documents attached successfully!");
      } else {
        Alert.alert("Error", responseJson.message || "An error occurred.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to attach documents.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Attach Documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Upload Documents */}
        {[{ label: 'PDP License', field: 'pdpLicense' }, { label: 'ID', field: 'id' }, { label: 'Police Clearance Certificate', field: 'policeClearance' }, { label: "Driver's License", field: 'driverLicense' }, { label: 'Car Inspection Report', field: 'inspectionReport' }].map(({ label, field }) => (
          <View key={field} style={styles.uploadContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handlePdfUpload(field)}>
              <Text style={styles.buttonText}>{documents[field] ? documents[field].name : `Attach ${label} (PDF)`}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Submit Documents</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, marginTop: 40 },
  form: { flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 20 },
  uploadContainer: { marginBottom: 25 },
  label: { fontSize: 18, color: '#333', marginBottom: 10 },
  uploadButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});


export default UploadDocuments;
