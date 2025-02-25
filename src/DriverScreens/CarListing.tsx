import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CarListing = ({ navigation }) => {
  const [carDetails, setCarDetails] = useState({
    carMaker: '',
    carModel: '',
    carYear: '',
    carSeats: '',
    carColor: '',
    carImage: null,
    licensePlate: '',
    userId: 'user-id-here' // Replace with actual userId
  });
const handleImageUpload = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your gallery to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Use the enum correctly
      allowsEditing: true,
      quality: 1,
    });

    console.log("Image picker result:", result);

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setCarDetails((prev) => ({
        ...prev,
        carImage: selectedImage
      }));
    } else {
      Alert.alert("Image Selection Canceled", "You did not select an image.");
    }
  } catch (error) {
    console.error("Image Picker Error:", error);
    Alert.alert("Error", "Something went wrong while selecting the image.");
  }
};
  
  
  
  

const handleSubmit = async () => {
  const { carMaker, carModel, carYear, carSeats, carColor, carImage, licensePlate, userId } = carDetails;

  if (!carMaker || !carModel || !carYear || !carSeats || !carColor || !carImage || !licensePlate) {
    Alert.alert("Missing Fields", "Please fill in all the car details before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append('carMaker', carMaker);
  formData.append('carModel', carModel);
  formData.append('carYear', carYear);
  formData.append('carSeats', carSeats);
  formData.append('carColor', carColor);
  formData.append('licensePlate', licensePlate);
  formData.append('userId', userId);

  if (carImage) {
    formData.append('carImage', {
      uri: carImage.uri,
      type: carImage.mimeType || 'image/jpeg',
      name: carImage.fileName || 'uploaded_image.jpg'
    });
  }

  try {
    const response = await fetch('http://192.168.1.100:3000/car_listing', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const responseJson = await response.json();
    console.log("Response:", responseJson);

    if (response.ok) {
      Alert.alert("Success", responseJson.message);
    } else {
      console.error("Error response:", responseJson);
      Alert.alert("Error", responseJson.error || "An error occurred.");
    }
  } catch (error) {
    console.error("Network error:", error);
    Alert.alert("Error", "Failed to submit car details.");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Upload Car Listing</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Maker</Text>
          <TextInput
            style={styles.input}
            value={carDetails.carMaker}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, carMaker: value }))}
            placeholder="Enter car maker"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={carDetails.carModel}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, carModel: value }))}
            placeholder="Enter car model"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            value={carDetails.carYear}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, carYear: value }))}
            placeholder="Enter car year"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Number of Seats</Text>
          <TextInput
            style={styles.input}
            value={carDetails.carSeats}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, carSeats: value }))}
            placeholder="Enter number of seats"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={carDetails.carColor}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, carColor: value }))}
            placeholder="Enter car color"
            placeholderTextColor="#ccc"
          />
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>{carDetails.carImage ? carDetails.carImage.name : "Attach Car Image"}</Text>
          </TouchableOpacity>
          {carDetails.carImage && (
            <Image source={{ uri: carDetails.carImage.uri }} style={styles.imagePreview} />
          )}
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.label}>License Plate</Text>
          <TextInput
            style={styles.input}
            value={carDetails.licensePlate}
            onChangeText={(value) => setCarDetails((prev) => ({ ...prev, licensePlate: value }))}
            placeholder="Enter license plate number"
            placeholderTextColor="#ccc"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Car Details</Text>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, color: '#333', backgroundColor: '#fff' },
  submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imagePreview: { width: 150, height: 150, marginTop: 15, borderRadius: 10, resizeMode: 'cover' },
});

export default CarListing;


