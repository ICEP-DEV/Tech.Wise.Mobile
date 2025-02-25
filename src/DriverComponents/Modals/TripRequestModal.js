import React, { useContext } from 'react';
import { Modal, StyleSheet, View, Text, Pressable, Image, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'; // Ensure you have this package installed
import { useNavigation } from '@react-navigation/native';
import { DestinationContext, OriginContext } from '../../contexts/contexts';
const TripRequestModal = ({ isVisible, request, onClose, onAccept, onDecline }) => {
  if (!isVisible) return null; // Don't render if the modal is not visible
  // Accessing the OriginContext and DestinationContext to set the coordinates
  // Accessing the OriginContext and DestinationContext to set the coordinates
  const { dispatchOrigin } = useContext(OriginContext); // Get dispatchOrigin from OriginContext
  const { dispatchDestination } = useContext(DestinationContext); // Get dispatchDestination from DestinationContext

  const handleAccept = () => {
    // Set the pickup and destination coordinates in their respective contexts using dispatch
    dispatchOrigin({
      type: 'ADD_ORIGIN', // Action type, modify according to your reducer
      payload: {
        latitude: request.pickup.latitude,
        longitude: request.pickup.longitude,
      },
    });

    dispatchDestination({
      type: 'ADD_DESTINATION', // Action type, modify according to your reducer
      payload: {
        latitude: request.destination.latitude,
        longitude: request.destination.longitude,
      },
    });

    onClose(); // Close the modal after accepting
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Icon name="close" color="#333" size={24} />
          </Pressable>

          <Text style={styles.headerText}>Trip Details</Text>

          <ScrollView contentContainerStyle={styles.detailsContainer}>
            <View style={styles.customerImageContainer}>
              <Image source={request.passenger.profileImage} style={styles.customerImage} />
              <View>
                <Text style={styles.detailText}>Passenger: {request.passenger.name}</Text>
                {/* <Text style={styles.detailText}>Phone: {request.passenger.phone}</Text> */}
              </View>
            </View>

            {/* Icons for Pickup and Destination */}
            <View style={styles.locationContainer}>
              <Icon name="place" color="#28a745" size={20} />
              <Text style={styles.detailText}>Pickup: {request.pickup.street}, {request.pickup.area}</Text>
            </View>

            <View style={styles.locationContainer}>
              <Icon name="place" color="#dc3545" size={20} />
              <Text style={styles.detailText}>Destination: {request.street}, {request.area}</Text>
            </View>

            <Text style={styles.fareText}>Fare: R {request.fare.toFixed(2)}</Text>
          </ScrollView>

          {/* Accept and Decline buttons */}
          <View style={styles.buttonsContainer}>
            <Pressable style={[styles.button, styles.acceptButton]} onPress={onAccept}>
              <Text style={styles.buttonText}
                 onPress={handleAccept}
              >
                Accept
              </Text>
            </Pressable>
            <Pressable style={[styles.button, styles.declineButton]} onPress={onDecline}>
              <Text style={styles.buttonText}>Decline</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for emphasis
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailsContainer: {
    marginBottom: 20,
    width: '100%', // Full width for details
    paddingBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
    flexShrink: 1, // Allow text to shrink and wrap
  },
  fareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745', // Green for fare
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Full width for buttons
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexGrow: 1,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#28a745', // Green for accept
  },
  declineButton: {
    backgroundColor: '#dc3545', // Red for decline
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  customerImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  customerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
    resizeMode: 'cover'
  }
});

export default TripRequestModal;