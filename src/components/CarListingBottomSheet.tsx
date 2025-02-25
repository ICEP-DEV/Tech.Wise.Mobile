import { BlurView } from 'expo-blur';
import React, { useContext, useEffect } from 'react';
import { Pressable, StyleSheet, SectionList, Image, Dimensions } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { Icon } from 'react-native-elements';
import { DestinationContext } from '../contexts/contexts';
import { carTypeData } from '../global/data';
import { useSelector } from 'react-redux'; // Import useSelector

const { height } = Dimensions.get("window");

const CarListingBottomSheet = ({ navigation }) => {
  const { dispatchDestination } = useContext(DestinationContext);

  // Accessing distance and duration from the Redux store
  const distance = useSelector(state => state.location.distance);
  const duration = useSelector(state => state.location.duration);

  useEffect(() => {
    // Logging the distance and duration whenever they change
    if (distance !== null && duration !== null) {
      console.log('Distance:', distance, 'km');
      console.log('Duration:', duration, 'mins');
    }
  }, [distance, duration]); // Dependency array to re-run effect when distance or duration changes

  const handleItemPress = (item) => {
    console.log('Car Type Selected:', item);
    navigation.navigate('DriverDetailsBottomSheet', { id: item.id });
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.overlay} />
      <BlurView intensity={70} tint="light" style={styles.blurView}>
        <Pressable onPress={() => navigation.goBack()} style={styles.cancelContainer}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Choose Your Ride</Text>
        </View>
        <SectionList
          sections={carTypeData}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleItemPress(item)} style={styles.itemContainer}>
              <Image source={item.image} style={styles.carImage} />
              <View style={styles.carInfo}>
                <Text style={styles.carName}>{item.name}</Text>
                <Text style={styles.carNote}>{item.note}</Text>
                <View style={styles.promotionContainer}>
                  <View style={styles.iconTextRow}>
                    <Icon
                      name="account"
                      type="material-community"
                      size={16}
                      color="gray"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.promotionText}>{item.seats}</Text>
                  </View>
                  <Text style={styles.carPrice}>R{item.price}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </BlurView>
    </View>
  );
};

export default CarListingBottomSheet;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)', // Semi-transparent background for overlay
  },
  overlay: {
    flex: 1,
    height: '60%', // Adjust the height of the transparent area (adjust as needed)
  },
  blurView: {
    height: '40%', // Set the bottom sheet to occupy 40% of the screen height
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f8f8f8',
    resizeMode: 'contain',
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  carNote: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  promotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionText: {
    fontSize: 14,
    color: '#ff0000',
    marginRight: 10,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});
