import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CustomDrawer from '../components/CustomDrawer';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

const CarListing = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setCarDetails((prev) => ({
          ...prev,
          carImage: selectedImage
        }));
      }
    } catch (error) {
      console.error("Image Picker Error:", error);
      Alert.alert("Error", "Something went wrong while selecting the image.");
    }
  };

  const handleSubmit = async () => {
    const { carMaker, carModel, carYear, carSeats, carColor, carImage, licensePlate, userId } = carDetails;

    // Validate all fields
    const missingFields = [];
    if (!carMaker) missingFields.push('Car Maker');
    if (!carModel) missingFields.push('Car Model');
    if (!carYear) missingFields.push('Year');
    if (!carSeats) missingFields.push('Number of Seats');
    if (!carColor) missingFields.push('Color');
    if (!licensePlate) missingFields.push('License Plate');
    if (!carImage) missingFields.push('Car Image');

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please provide the following details:\n${missingFields.join('\n')}`,
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);

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

      if (response.ok) {
        Alert.alert(
          "Success",
          "Your car has been listed successfully!",
          [{ text: "Continue", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", responseJson.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Failed to submit car details. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      label: 'Car Maker',
      value: carDetails.carMaker,
      field: 'carMaker',
      placeholder: 'e.g., Toyota, Honda, BMW',
      icon: 'car-sport-outline'
    },
    {
      label: 'Car Model',
      value: carDetails.carModel,
      field: 'carModel',
      placeholder: 'e.g., Corolla, Civic, X5',
      icon: 'options-outline'
    },
    {
      label: 'Year',
      value: carDetails.carYear,
      field: 'carYear',
      placeholder: 'e.g., 2022',
      icon: 'calendar-outline',
      keyboardType: 'numeric'
    },
    {
      label: 'Number of Seats',
      value: carDetails.carSeats,
      field: 'carSeats',
      placeholder: 'e.g., 5',
      icon: 'people-outline',
      keyboardType: 'numeric'
    },
    {
      label: 'Color',
      value: carDetails.carColor,
      field: 'carColor',
      placeholder: 'e.g., Black, White, Silver',
      icon: 'color-palette-outline'
    },
    {
      label: 'License Plate',
      value: carDetails.licensePlate,
      field: 'licensePlate',
      placeholder: 'e.g., ABC-1234',
      icon: 'card-outline'
    },
  ];
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0DCAF0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Icon type="material-community" name="menu" color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Car Details</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Introduction */}
          <View style={styles.introContainer}>
            <Text style={styles.introTitle}>Car Details</Text>
            <Text style={styles.introText}>
              Please provide accurate information about your car to help passengers identify it.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {inputFields.map((field, index) => (
              <View key={field.field} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name={field.icon} size={20} color="#0DCAF0" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={field.value}
                    onChangeText={(value) =>
                      setCarDetails((prev) => ({ ...prev, [field.field]: value }))
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor="#adb5bd"
                    keyboardType={field.keyboardType || 'default'}
                  />
                </View>
              </View>
            ))}

            {/* Image Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Car Image</Text>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={handleImageUpload}
              >
                {carDetails.carImage ? (
                  <Image
                    source={{ uri: carDetails.carImage.uri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Ionicons name="camera" size={32} color="#0DCAF0" />
                    <Text style={styles.uploadText}>Tap to upload car photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              {carDetails.carImage && (
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={handleImageUpload}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.submitIcon} />
                <Text style={styles.submitButtonText}>List My Car</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0DCAF0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    left: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introContainer: {
    padding: 20,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 16,
    color: '#212529',
  },
  imageUploadButton: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  uploadPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6c757d',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  changeImageButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  changeImageText: {
    color: '#0DCAF0',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0DCAF0',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CarListing;