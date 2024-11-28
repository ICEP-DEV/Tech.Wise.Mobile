import { BlurView } from 'expo-blur';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, FlatList, SectionList, Image } from 'react-native';
import { View, Text } from 'react-native-animatable';
import { Icon } from 'react-native-elements';
import { DestinationContext } from '../contexts/contexts';
import { carTypeData } from '../global/data';

const PendingTripsBottomSheet = ({ navigation }) => {
    //   const { dispatchDestination } = useContext(DestinationContext);

    //   const handleItemPress = (item) => {
    //     console.log('Car Type Selected:', item);
    //     // navigation.navigate('DriverDetailsBottomSheet', { id: item.id });
    //   };


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
                {/* display pending trips from customers */}
            </BlurView>
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
    promotionText: {
        fontSize: 14,
        color: '#28a745',
        fontWeight: '600',
    },
    carPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
    },
});
