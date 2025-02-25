import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrivacySettings from './PrivacySettings';

const CustomerProfile = ({ navigation }) => {
  const customer = {
    name: 'Jimmy Tau',
    email: 'jane.doe@gmail.com',
    phone: '0798181448',
    profileImage: require('../../assets/customer.jpg'),
    totalTrips: 75,
    preferredPaymentMethod: 'Credit Card',
    language: 'English',
    communication: 'Phone',
    status: 'Active',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', flex:1, textAlign: 'center' }}>Customer Profile</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Profile Header */}
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderColor: '#ddd',
            backgroundColor: '#0dcaf0',
            borderRadius: 15,
            top: -15,
            paddingTop: 15,
          }}
        >
          <Image
            source={customer.profileImage}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 10,
            }}
          />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>
            {customer.name}
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 2 }}>
            {customer.email}
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>{customer.phone}</Text>
        </View>

        {/* Booking History */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Booking History
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Total Trips: {customer.totalTrips}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#848884',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('TripHistory')}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Payment Methods
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Preferred Method: {customer.preferredPaymentMethod}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#848884',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('AddPaymentMethodScreen')}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>
              Update Payment Methods
            </Text>
          </TouchableOpacity>
        </View>

        {/* Communication Preferences */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Communication Preferences
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 5 }}>
            Preferred Language: {customer.language}
          </Text>
          <Text style={{ fontSize: 16 }}>
            Preferred Method: {customer.communication}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#848884',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('LanguageSettings')}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Change Language</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Privacy Settings
          </Text>
          <Text style={{ fontSize: 16 }}>Manage your privacy preferences.</Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: '#848884',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Update Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            marginTop: 20,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => console.log('Logged out')}
          >
            <Text style={{ color: '#fff', fontSize: 12 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerProfile;
