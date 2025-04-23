import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  TextInput, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import { io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../api';
import driverImage from '../../../assets/driver.png';
import { connectSocket, emitAcceptTrip, emitCancelTrip } from '../../configSocket/socketConfig';

const { width, height } = Dimensions.get('window');

const TripRequestModal = ({ isVisible, request, onClose, onTripUpdate }) => {
  const navigation = useNavigation();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));

  const customerId = request?.customerId;
  const tripId = request?.id;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [isVisible, customerId]);

  const fetchCustomerDetails = async (customerId) => {
    setLoading(true);
    try {
      const apiUrl = `${api}customer/${customerId}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setCustomerDetails(data);
    } catch (error) {
      console.error('❌ Error fetching customer details:', error);
      setCustomerDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      // Update trip status via your backend API
      const response = await fetch(`${api}trips/${tripId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted',
          cancellation_reason: null,
          cancel_by: null,
        }),
      });

      if (!response.ok) throw new Error('Error updating trip status');

      emitAcceptTrip(tripId, customerId);
      onTripUpdate(tripId); // Remove trip from the pending list
      onClose();
      navigation.navigate("PendingRequests", { tripAccepted: true, tripData: request });
    } catch (error) {
      console.error("Error updating trip status:", error);
    }
  };

  const handleDecline = async () => {
    try {
      if (!cancellationReason) {
        // Show a prompt or alert if the cancellation reason is empty (optional)
        return alert("Please provide a cancellation reason.");
      }

      // Update trip status via your backend API
      const response = await fetch(`${api}trips/${tripId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'declined',
          cancellation_reason: cancellationReason,
          cancel_by: 'driver',  // Assuming 'driver' is the cancel_by value
        }),
      });

      if (!response.ok) throw new Error('Error updating trip status');

      emitCancelTrip(tripId, customerId);
      onTripUpdate(tripId); // Remove trip from the pending list
      onClose();
      navigation.navigate("PendingRequests", { tripAccepted: false, tripData: request });
    } catch (error) {
      console.error("Error updating trip status:", error);
    }
  };

  if (!isVisible || !request) return null;

  // Calculate trip details
  const pickupLocation = request?.pickUpLocation || 'Not specified';
  const dropoffLocation = request?.dropOffLocation || 'Not specified';
  const estimatedDistance = request?.distance ? `${request.distance} km` : 'Not available';
  const estimatedFare = request?.fare ? `$${request.fare}` : 'Not available';

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.headerHandle} />
            <Text style={styles.headerText}>New Trip Request</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" color="#64748b" size={22} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0DCAF0" />
              <Text style={styles.loadingText}>Loading customer details...</Text>
            </View>
          ) : customerDetails ? (
            <View style={styles.contentContainer}>
              <View style={styles.customerContainer}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={customerDetails.profile_picture ? { uri: customerDetails.profile_picture } : driverImage}
                    style={styles.profileImage}
                  />
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customerDetails.name || "Customer"}</Text>
                  <View style={styles.customerDetail}>
                    <Icon name="person" type="material" size={16} color="#64748b" />
                    <Text style={styles.customerDetailText}>{customerDetails.gender || "Not specified"}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" type="material" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8</Text>
                    <Text style={styles.tripCountText}>(124 trips)</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tripDetailsContainer}>
                <Text style={styles.sectionTitle}>Trip Details</Text>
                
                <View style={styles.tripDetail}>
                  <View style={styles.iconContainer}>
                    <Icon name="location-pin" type="material" size={20} color="#0DCAF0" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Pickup</Text>
                    <Text style={styles.detailValue}>{pickupLocation}</Text>
                  </View>
                </View>
                
                <View style={styles.tripDetail}>
                  <View style={styles.iconContainer}>
                    <Icon name="flag" type="material" size={20} color="#0DCAF0" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Dropoff</Text>
                    <Text style={styles.detailValue}>{dropoffLocation}</Text>
                  </View>
                </View>
                
                {/* <View style={styles.tripMetrics}>
                  <View style={styles.metricItem}>
                    <Icon name="map" type="material" size={18} color="#0DCAF0" />
                    <Text style={styles.metricValue}>{estimatedDistance}</Text>
                    <Text style={styles.metricLabel}>Distance</Text>
                  </View>
                  
                  <View style={styles.metricDivider} />
                  
                  <View style={styles.metricItem}>
                    <Icon name="attach-money" type="material" size={18} color="#0DCAF0" />
                    <Text style={styles.metricValue}>{estimatedFare}</Text>
                    <Text style={styles.metricLabel}>Fare</Text>
                  </View>
                </View> */}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reason for declining (required)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter reason if declining the trip"
                  value={cancellationReason}
                  onChangeText={setCancellationReason}
                  placeholderTextColor="#94a3b8"
                  multiline={true}
                  numberOfLines={2}
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.declineButton]} 
                  onPress={handleDecline}
                  activeOpacity={0.8}
                >
                  <Icon name="close" type="material" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.acceptButton]} 
                  onPress={handleAccept}
                  activeOpacity={0.8}
                >
                  <Icon name="check" type="material" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" type="material" size={48} color="#f43f5e" />
              <Text style={styles.errorText}>Failed to load customer details</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchCustomerDetails(customerId)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '90%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    position: 'relative',
  },
  headerHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  customerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    borderRadius: 40,
    padding: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#0DCAF0',
    shadowColor: "#0DCAF0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  customerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  customerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerDetailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 4,
  },
  tripCountText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
  },
  tripDetailsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  tripDetail: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(13, 202, 240, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  tripMetrics: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 4,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: '#0DCAF0',
    marginLeft: 10,
  },
  declineButton: {
    backgroundColor: '#f43f5e',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0DCAF0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TripRequestModal;