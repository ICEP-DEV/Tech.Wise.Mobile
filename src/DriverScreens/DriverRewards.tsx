import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const { width } = Dimensions.get('window'); // Get full screen width

const DriverRewards = () => {
  const [points, setPoints] = useState(1200);

  const rewards = [
    { id: '1', name: 'Fuel Voucher (R50)', cost: 500 },
    { id: '2', name: 'Bonus Cash (R100)', cost: 1000 },
    { id: '3', name: 'Coffee Voucher', cost: 200 },
  ];

  return (
    <View style={styles.container}>
      {/* Image container with overlay text */}
      <View style={styles.imageContainer}>
       {} <Image source={require('./reward.jpg')} style={styles.image} />
        <Text style={styles.header}>Driver Rewards</Text> {/* Removed icons */}
      </View>

      {/* Points Display */}
      <Text style={styles.points}>{points} Points</Text>

      {/* First Reward Card */}
      <TouchableOpacity style={styles.rewardItem}>
        <Text style={styles.rewardText}>{rewards[0].name}</Text>
        <Text style={styles.rewardCost}>{rewards[0].cost} Points</Text>
      </TouchableOpacity>

      {/* Remaining Rewards List */}
      <FlatList
        data={rewards.slice(1)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.rewardItem}>
            <Text style={styles.rewardText}>{item.name}</Text>
            <Text style={styles.rewardCost}>{item.cost} Points</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Rewards">
        <Drawer.Screen name="Driver Rewards" component={DriverRewards} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', alignItems: 'center', paddingTop: 20 },
  imageContainer: {
    position: 'relative',
    width: width,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: '40%', // Adjust position over image
    width: '100%',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    paddingVertical: 10,
  },
  points: { fontSize: 22, fontWeight: 'bold', color: 'black', marginVertical: 15 },
  rewardItem: {
    backgroundColor: '#4DB6AC',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    width: width * 0.8, // Increased width
  },
  rewardText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  rewardCost: { fontSize: 16, color: '#E0F7FA' },
});

export default DriverRewards;
