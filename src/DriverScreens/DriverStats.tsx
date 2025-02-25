import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { Icon } from 'react-native-elements';
import { colors, parameters } from '../global/styles';
import { useSelector } from "react-redux";
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const DriverStats = ({ navigation }) => {
  const [view, setView] = useState('daily');
  const [animationValue] = useState(new Animated.Value(1));
  const [isOnline, setIsOnline] = useState(false);
  const [documentsFound, setDocumentsFound] = useState(true); // State to track if documents are found
  const user_id = useSelector((state) => state.auth.user?.user_id || "");
  console.log("User ddddddddddddddID:", user_id);
  
  const stats = {
    daily: {
      ridesAccepted: 20,
      ridesDeclined: 2,
      earnings: '$70',
      ratings: '4.7/5',
      workedHours: '6 hrs',
    },
    weekly: {
      ridesAccepted: 112,
      ridesDeclined: 20,
      earnings: '$450',
      ratings: '4.7/5',
      workedHours: '35 hrs',
    },
    monthly: {
      ridesAccepted: 500,
      ridesDeclined: 60,
      earnings: '$1800',
      ratings: '4.8/5',
      workedHours: '150 hrs',
    },
  };

  const [fontsLoaded] = useFonts({
    AbrilFatface: require('../../assets/fonts/AbrilFatface-Regular.ttf'),
  });

  useEffect(() => {
    if (!user_id) return; // Prevent running when user_Id is null
    
    const fetchDriverDocuments = async () => {
      try {
        console.log("Fetching driver documents for:", user_id);
        const response = await axios.get(`http://10.0.2.2:3000/api/getDriverDocuments?userId=${user_id}`);
        
        console.log("Driver Documents Response:", response.data);
        
        // Check if documents are found
        if (response.data.documentsFound) {
          setDocumentsFound(true);  // Documents found
          // You can handle the documents data here if needed
        } else {
          setDocumentsFound(false);  // Documents not found
        }
      } catch (error) {
        // console.error("Error fetching driver documents:", error.response?.data || error.message);
        setDocumentsFound(false);  // Set to false if there's an error
      }
    };
  
    fetchDriverDocuments();
  }, [user_id]); // Make sure this effect runs when `user_Id` changes
  
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const chartData = {
    daily: {
      labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
      datasets: [
        { data: [5, 8, 6, 4, 7], color: () => 'rgba(34, 202, 34, 1)' },
        { data: [1, 2, 3, 2, 1], color: () => 'rgba(202, 34, 34, 1)' },
      ],
      legend: ['Accepted', 'Declined'],
    },
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        { data: [12, 10, 15, 14, 18, 20, 22], color: () => 'rgba(34, 202, 34, 1)' },
        { data: [3, 5, 2, 4, 3, 2, 1], color: () => 'rgba(202, 34, 34, 1)' },
      ],
      legend: ['Accepted', 'Declined'],
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        { data: [60, 70, 65, 80], color: () => 'rgba(34, 202, 34, 1)' },
        { data: [15, 10, 12, 8], color: () => 'rgba(202, 34, 34, 1)' },
      ],
      legend: ['Accepted', 'Declined'],
    },
  };

  const earningsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [50, 70, 65, 90, 85, 100, 120],
        color: () => 'rgba(0, 0, 0, 1)',
        strokeWidth: 2,
      },
    ],
    legend: ['Daily Earnings'],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f7f7f7',
    backgroundGradientTo: '#f1f1f1',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    style: {
      borderRadius: 8,
    },
  };

  const handleGoOnline = () => {
    animateButton();
    setIsOnline(!isOnline);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.roundButton}
        >
          <Icon type="material-community" name="menu" color={colors.black} size={30} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {documentsFound ? (
          <>
            <Text style={styles.title}>Driver Insights</Text>

            <View style={styles.toggleContainer}>
              {['daily', 'weekly', 'monthly'].map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[styles.toggleButton, view === timeframe && styles.activeButton]}
                  onPress={() => setView(timeframe)}
                >
                  <Text style={[styles.toggleText, view === timeframe && styles.activeText]}>
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.statsContainer}>
              {Object.entries(stats[view]).map(([key, value]) => (
                <View style={styles.statBox} key={key}>
                  <Text style={styles.statTitle}>{key.replace(/([A-Z])/g, ' $1')}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.chartTitle}>
              Accepted vs. Declined Rides ({view === 'daily' ? 'Today' : view === 'weekly' ? 'Past Week' : 'Past Month'})
            </Text>
            <BarChart
              data={chartData[view]}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chart}
            />

            <Text style={styles.chartTitle}>Daily Earnings</Text>
            <LineChart
              data={earningsData}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </>
        ) : (
          <View style={styles.uploadDocumentsContainer}>
          <Text style={styles.uploadDocumentsText}>No documents found. Please upload your documents.</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => navigation.navigate('UploadDocuments')}
          >
            <Text style={styles.uploadButtonText}>Upload Documents</Text>
          </TouchableOpacity>
        </View>
        )}
      </ScrollView>

      <Animated.View style={{ transform: [{ scale: animationValue }] }}>
        <TouchableOpacity style={styles.goOnlineButton} onPress={handleGoOnline}>
          <Text style={styles.goOnlineText}>{isOnline ? 'OFF' : 'GO'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};
// const chartConfig = {
//   backgroundGradientFrom: '#ffffff',
//   backgroundGradientTo: '#ffffff',
//   color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   style: {
//     borderRadius: 16,
//   },
//   propsForDots: {
//     r: '6',
//     strokeWidth: '2',
//     stroke: '#ffa726',
//   },
// };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20, // Pushed a little down
    fontFamily: 'AbrilFatface',  // Apply Abril Fatface font
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  toggleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#000',  // Set active button color to black
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  activeText: {
    color: '#fff',  // Set active text color to white
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  statBox: {
    width: '45%',
    padding: 10,
    backgroundColor: '#e0e0e0',  // Grey background for stat boxes
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginVertical: 5,
  },
  statTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',  // Grey background for charts
  },
  icon1: {
    marginLeft: 10,
    marginTop: 5
  },

  goOnlineButton: {
    position: 'absolute',
    bottom: 10, // Adjust as needed
    left: screenWidth / 2 - 30, // Center the button horizontally
    backgroundColor: '#007aff', // Button color
    borderRadius: 30, // Circular shape
    width: 60, // Diameter
    height: 60, // Diameter
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    elevation: 5, // Shadow effect for Android
  },
  goOnlineText: {
    color: '#fff', // Text color
    fontSize: 24, // Font size for "GO"
    fontWeight: 'bold', // Bold text
  },
  header: {
    position: "absolute", // Ensures it floats on top of the screen
    top: 50, // Adjust for slight padding at the top
    left: 10, // Adjust for slight padding at the left
    zIndex: 100, // Ensures it's above other elements
  },
  roundButton: {
    backgroundColor: "#fff", // Add a background color
    borderRadius: 30, // Make it round (half of the width/height)
    width: 50, // Diameter of the circle
    height: 50, // Diameter of the circle
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
    shadowColor: "#000", // Add shadow (optional)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevation for Android
  },
  uploadDocumentsContainer: {
    top: 450, // Adjust for slight padding at the top
    flex: 1,  // Ensures it takes full screen space
    justifyContent: 'center',  // Centers vertically
    alignItems: 'center',  // Centers horizontally
    paddingHorizontal: 20,  // Adds horizontal padding for better spacing
    backgroundColor: '#f7f7f7',  // Optional background color
  },
  uploadDocumentsText: {
    fontSize: 18,
    textAlign: 'center',  // Centers the text
    marginBottom: 20,
    color: '#333',  // Darker color for better readability
  },
  uploadButton: {
    backgroundColor: colors.buttons,
    paddingVertical: 15,  // Adds padding for vertical spacing
    paddingHorizontal: 30,  // Adds horizontal padding for better button size
    borderRadius: 8,
    alignItems: 'center',  // Centers the text inside the button
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',  // Makes the text bold for better readability
  },

});

export default DriverStats;