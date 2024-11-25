import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheet, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Icon } from 'react-native-elements';
import { colors } from '../global/styles'; // Assuming colors are defined here
import { rideData } from '../global/data'; // Assuming rideData is imported from a file

const SavedPlacesBottomSheet = ({
  BottomSheetRef, // Ref for the BottomSheet component
  index, // Default index (starting state of the BottomSheet)
  snapPoints, // Snap points to define the size of the BottomSheet
  handleSheetChange, // Function to handle sheet state changes
  isSheetOpen, // Boolean to track the BottomSheet's open state
  handleArrowPress, // Function to handle the upward arrow button press
}) => {
  const [isSheetOpenState, setIsSheetOpenState] = useState(isSheetOpen);

  // Callback for rendering FlatList items
  const renderFlatListItems = useCallback(
    ({ item }) => (
      <View style={styles.view10}>
        <View style={styles.view11}>
          <Icon type="material-community" name="clock-time-four" color={colors.white} size={18} />
        </View>
        <View>
          <Text style={{ fontSize: 15, color: colors.grey1 }}>{item.street}</Text>
          <Text style={{ color: colors.grey4 }}>{item.area}</Text>
        </View>
      </View>
    ),
    []
  );

  // Memoize snap points to avoid unnecessary re-rendering
  const memoizedSnapPoints = useMemo(() => snapPoints ?? ['70%'], [snapPoints]);

  // Handler for when the sheet is fully closed
  const handleSheetChangeCallback = useCallback(
    (index) => {
      if (index === -1) setIsSheetOpenState(false); // If BottomSheet is fully closed
    },
    []
  );

  return (
    <>
      <BottomSheet
        ref={BottomSheetRef}
        index={index}
        snapPoints={memoizedSnapPoints}
        onChange={handleSheetChangeCallback}
        enablePanDownToClose={true}
      >
        <BottomSheetFlatList
          keyboardShouldPersistTaps="always"
          data={rideData}
          keyExtractor={(item) => item.id}
          renderItem={renderFlatListItems}
          contentContainerStyle={styles.contentContainer}
          ListHeaderComponent={
            <View style={styles.view10}>
              <View style={styles.view11}>
                <Icon type="material-community" name="star" color={colors.white} size={20} />
              </View>
              <View>
                <Text style={styles.text9}>Saved Places</Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <View style={styles.view10}>
                <View style={styles.view11}>
                  <Icon type="material-community" name="map-marker" color={colors.white} size={20} />
                </View>
                <View>
                  <Text style={styles.text9}>Set location on map</Text>
                </View>
              </View>
              <View style={styles.view10}>
                <View style={styles.view11}>
                  <Icon type="material-community" name="skip-next" color={colors.white} size={20} />
                </View>
                <View>
                  <Text style={styles.text9}>Enter destination later</Text>
                </View>
              </View>
            </View>
          }
        />
      </BottomSheet>

      {/* Upward Arrow Icon */}
      {!isSheetOpenState && (
        <TouchableOpacity style={styles.arrowButton} onPress={handleArrowPress}>
          <Icon type="material-community" name="arrow-up" size={30} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = {
  view10: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  view11: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 10,
  },
  text9: {
    fontSize: 16,
    color: colors.white,
    marginLeft: 10,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  arrowButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 10,
  },
};

export default SavedPlacesBottomSheet;
