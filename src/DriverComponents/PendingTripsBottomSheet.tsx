import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { RequestsData } from '../global/data'; // Import your data
import  TripRequestModal  from '../DriverComponents/Modals/TripRequestModal'

const PendingTripsBottomSheet = ({ navigation }) => {
    const [selectedRequest, setSelectedRequest] = useState(null); // State to hold selected request

    const renderRequest = ({ item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.passengerName}>{item.passenger.name}</Text>
          <Text style={styles.detailText}>Pickup: {item.pickup.street}, {item.pickup.area}</Text>
          <Text style={styles.detailText}>Destination: {item.street}, {item.area}</Text>
          <Text style={styles.detailText}>Fare: R {item.fare.toFixed(2)}</Text>
        </View>
        <Pressable 
          style={styles.actionButton} 
          onPress={() => setSelectedRequest(item)} // Set selected item
        >
          <Text style={styles.actionText}>View</Text>
        </Pressable>
      </View>
    );
      
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />
      <BlurView intensity={80} tint="light" style={styles.blurView}>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelContainer}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Pending Requests</Text>
        </View>
        <FlatList
          data={RequestsData}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContent}
        />
      </BlurView>

      {/* Conditionally render TripRequestModal if an item is selected */}
      {selectedRequest && (
        <TripRequestModal
          isVisible={true}
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)} // Close the modal
        />
      )}
    </View>
  );
};

export default PendingTripsBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Semi-transparent background for overlay
  },
  overlay: {
    flex: 1,
  },
  blurView: {
    height: '40%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  cancelContainer: {
    alignSelf: 'flex-end',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  headerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#6c757d',
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
