import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from "../components/CustomDrawer"
import { Icon } from 'react-native-elements';
const ViewDocuments = ({ route, navigation }) => {
      const [drawerOpen, setDrawerOpen] = useState(false)
      const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const { documents } = route.params;

  const handleOpenDocument = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
              <Icon type="material-community" name="menu" color="#fff" size={22} />
            </TouchableOpacity>
      <Text style={styles.title}>Your Uploaded Documents</Text>
      {Object.entries(documents).map(([key, url]) => (
        <View key={key} style={styles.docCard}>
          <Text style={styles.docLabel}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
          <TouchableOpacity onPress={() => handleOpenDocument(url)} style={styles.viewButton}>
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("UploadDocuments")}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editText}>Update Documents</Text>
      </TouchableOpacity>
      <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  docCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  docLabel: { fontSize: 16, fontWeight: '500' },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#0DCAF0',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6
  },
  viewText: { color: '#fff', marginLeft: 5 },
  editButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' }
});

export default ViewDocuments;
