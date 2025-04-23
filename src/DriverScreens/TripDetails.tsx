import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ArrowLeft, HelpCircle, RefreshCw, Receipt, User } from 'lucide-react-native';
import MapComponent from '../components/MapComponent';

export default function TripDetails({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
         onPress={() => navigation.goBack()}
        style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />

        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Ride with Elisha</Text>
          <Text style={styles.headerDate}>Tue, Jan 7, 2025</Text>
        </View>
        <TouchableOpacity
         onPress={() => navigation.navigate('DriverProfile')}
        >
        <View style={styles.profileIcon}>
          <User size={24} color="#666" />
        </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Map */}
        <View style={styles.mapContainer}>
        <MapComponent
         
        // driverLocation={driverLocation}  // Pass the driver location
        />
          <View style={styles.tripInfo}>
            <Text style={styles.tripInfoText}>3 km, 7 min</Text>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.content}>
          <View style={styles.locations}>
            <View style={styles.locationItem}>
              <View style={styles.locationIndicator}>
                <View style={[styles.dot, styles.dotGreen]} />
                <View style={styles.line} />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationTitle}>26 Taljaard Road, Bartlett, Ekurhuleni</Text>
                <Text style={styles.locationTime}>16:32</Text>
              </View>
            </View>
            <View style={styles.locationItem}>
              <View style={styles.locationIndicator}>
                <View style={[styles.dot, styles.dotBlue]} />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationTitle}>13 Bentel Avenue, Jansen Park, Ekurhuleni</Text>
                <Text style={styles.locationTime}>16:38</Text>
              </View>
            </View>
          </View>

          <Text style={styles.additionalInfo}>
            Additional ride details can be found in your email receipt
          </Text>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.button}>
            <HelpCircle size={20} color="#000" />
            <Text style={styles.buttonText}>Get help with ride</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <RefreshCw size={20} color="#000" />
            <Text style={styles.buttonText}>Rebook</Text>
          </TouchableOpacity>

          {/* Payment Details */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Fare • Go Hatch</Text>
                <Text style={styles.paymentAmount}>R 68.29</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Booking fee</Text>
                <Text style={styles.paymentAmount}>R 2.71</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={[styles.paymentLabel, styles.discountText]}>Discount</Text>
                <Text style={[styles.paymentAmount, styles.discountText]}>-R 14.00</Text>
              </View>
              <View style={[styles.paymentRow, styles.totalRow]}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalAmount}>R 57.00</Text>
              </View>
              <View style={styles.paymentMethod}>
                <View style={styles.cashIndicator}>
                  <View style={styles.cashIcon}>
                    <Text style={styles.cashIconText}>R</Text>
                  </View>
                  <Text style={styles.paymentMethodText}>Cash</Text>
                </View>
                <Text style={styles.paymentAmount}>R 57.00</Text>
              </View>
            </View>
          </View>

          {/* Receipt Button */}
          <TouchableOpacity style={styles.button}>
            <Receipt size={20} color="#000" />
            <Text style={styles.buttonText}>Get receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    height: 200,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  tripInfo: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripInfoText: {
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  locations: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotGreen: {
    backgroundColor: '#22c55e',
  },
  dotBlue: {
    backgroundColor: '#3b82f6',
  },
  line: {
    width: 2,
    height: 40,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationTime: {
    fontSize: 14,
    color: '#666',
  },
  additionalInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  paymentSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  paymentDetails: {
    gap: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    color: '#666',
  },
  paymentAmount: {
    fontWeight: '500',
  },
  discountText: {
    color: '#3b82f6',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontWeight: '600',
  },
  totalAmount: {
    fontWeight: '600',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cashIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cashIconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethodText: {
    fontSize: 16,
  },
});