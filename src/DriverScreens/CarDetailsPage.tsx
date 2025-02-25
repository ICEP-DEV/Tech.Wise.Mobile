import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const CarDetailsPage = () => {
  // Dummy data for driver and car details
  const driverDetails = {
    name: 'John Doe',
    contact: '+1 234 567 890',
  };

  const carDetails = {
    color: 'Blue',
    licensePlate: 'XYZ-1234',
    model: 'Toyota Corolla 2022',
    type: 'Sedan',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Car Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('./car.jpg')} // Ensure car.jpg is in the same directory as this file
          style={styles.carImage}
        />
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Car Details</Text>

      {/* Driver Details */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Driver Details</Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Name: </Text>
          {driverDetails.name}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Contact: </Text>
          {driverDetails.contact}
        </Text>
      </View>

      {/* Car Details */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Car Information</Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Color: </Text>
          {carDetails.color}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>License Plate: </Text>
          {carDetails.licensePlate}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Model: </Text>
          {carDetails.model}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.label}>Type: </Text>
          {carDetails.type}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#ddd',
  },
  carImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  detailItem: {
    fontSize: 16,
    marginVertical: 5,
    color: '#444',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CarDetailsPage;

// https://dribbble.com/shots/20460757-Car-Rental-Mobile-App