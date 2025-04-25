"use client"

import { useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import { BarChart, LineChart } from "react-native-chart-kit"
import { useFonts } from "expo-font"
import { Icon } from "react-native-elements"
import { useSelector } from "react-redux"
import axios from "axios"
import { api } from "../../api"
import CustomDrawer from "../components/CustomDrawer"

const screenWidth = Dimensions.get("window").width

const DriverStats = ({ navigation, route }) => {
  const [view, setView] = useState("daily")
  const [animationValue] = useState(new Animated.Value(1))
  const [isOnline, setIsOnline] = useState(false)
  const [secondsOnline, setSecondsOnline] = useState(0)
  const [lastOnlineDuration, setLastOnlineDuration] = useState(0)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const [sessionTime, setSessionTime] = useState(0)
  const [totalWorkedSeconds, setTotalWorkedSeconds] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  })
  const [onlineTime, setOnlineTime] = useState(0)

  const timerRef = useRef(null)
  const user_id = useSelector((state) => state.auth.user?.user_id || "")
  const [documentsFound, setDocumentsFound] = useState(true)

  const [fontsLoaded] = useFonts({
    AbrilFatface: require("../../assets/fonts/AbrilFatface-Regular.ttf"),
  })

  // Format seconds to hours and minutes
  const formatWorkedHours = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours} hrs ${minutes} min`
  }
  

  // Custom stats object that uses the dynamic worked hours
  const [customStats, setCustomStats] = useState({
    daily: {
      ridesAccepted: 0,
      ridesDeclined: 0,
      earnings: "$70",
      ratings: "/5",
      // workedHours: formatWorkedHours(0)
    },
    weekly: {
      ridesAccepted: 0,
      ridesDeclined: 0,
      earnings: "$450",
      ratings: "/5",
      // workedHours: formatWorkedHours(0)
    },
    monthly: {
      ridesAccepted: 0,
      ridesDeclined: 0,
      earnings: "$1800",
      ratings: "/5",
      // workedHours: formatWorkedHours(0)
    },
  })

  // Check if we received updated worked time from PendingRequests
  useEffect(() => {
    if (route.params?.workedSeconds) {
      console.log("Received worked seconds:", route.params.workedSeconds)
      const receivedSeconds = route.params.workedSeconds
      setTotalWorkedSeconds(receivedSeconds)
    }
  }, [route.params?.workedSeconds])

  // Update the stats object whenever totalWorkedSeconds changes
  // useEffect(() => {
  //   setCustomStats((prev) => ({
  //     daily: {
  //       ...prev.daily,
  //       workedHours: formatWorkedHours(totalWorkedSeconds.daily),
  //     },
  //     weekly: {
  //       ...prev.weekly,
  //       workedHours: formatWorkedHours(totalWorkedSeconds.weekly),
  //     },
  //     monthly: {
  //       ...prev.monthly,
  //       workedHours: formatWorkedHours(totalWorkedSeconds.monthly),
  //     },
  //   }))
  // }, [totalWorkedSeconds])

// In DriverStats.tsx - Modify the useEffect that fetches driver state

useEffect(() => {
  const fetchDriverState = async () => {
    try {
      const response = await axios.get(`${api}getDriverState?userId=${user_id}`)
      
      // Log the full response to debug
      console.log("API Response:", response.data);
      
      const {
        state,
        online_time = "00:00:00", // This is the format from your API
        workedTime = { daily: 0 }, // Only track daily now
      } = response.data

      // Parse the online_time string into seconds
      const parsedSeconds = parseTimeStringToSeconds(online_time);
      console.log("Parsed online time to seconds:", parsedSeconds);

      // Set online/offline status
      setIsOnline(state === "online")

      if (state === "online") {
        setSecondsOnline(parsedSeconds);
        console.log("Driver is online, setting secondsOnline to:", parsedSeconds);
      } else {
        // For offline state, set the last online duration
        setLastOnlineDuration(parsedSeconds);
        console.log("Driver is offline, setting lastOnlineDuration to:", parsedSeconds);
      }

      // Set worked hours - only daily now
      setTotalWorkedSeconds({
        daily: workedTime.daily || 0,
        weekly: 0, // We're not using these anymore
        monthly: 0, // We're not using these anymore
      });

      // Start timer if driver is online
      if (state === "online" && !timerRef.current) {
        startTimer()
      }
    } catch (error) { 
      console.error("Error fetching driver state:", error.message)
    }
  }

  if (user_id) fetchDriverState()

  return () => stopTimer()
}, [user_id])
// Add this function to parse the time string
const parseTimeStringToSeconds = (timeString) => {
  try {
    // Format: "HH:MM:SS"
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  } catch (error) {
    console.error("Error parsing time string:", error);
    return 0;
  }
}

  //fetch session time from the API
  useEffect(() => {
    const fetchSessionTime = async () => {
      try {
        const response = await axios.get(`${api}getDriverLog?userId=${user_id}`)
        const { totalSessionTime } = response.data

        // You can now include this in total worked time, or show it separately
        setTotalWorkedSeconds((prev) => ({
          daily: prev.daily, // Or update accordingly
          weekly: prev.weekly,
          monthly: totalSessionTime, // Example: show all session time in monthly
        }))
      } catch (error) {
        console.error("Error fetching session time:", error.message)
      }
    }

    if (user_id) {
      fetchSessionTime()
    }
  }, [user_id])

  //fetcRideStatus from the API
  useEffect(() => {
    const fetchRideStats = async () => {
      try {
        const response = await axios.get(`${api}getDriverTrips?userId=${user_id}`)

        const { trips, ratings } = response.data // Assuming ratings is part of the response

        const acceptedRides = trips.filter((trip) => trip.statuses === "accepted")
        const declinedRides = trips.filter((trip) => trip.statuses === "declined")

        // Assuming ratings is in the form of a single rating value
        const driverRating = ratings?.average || "0" // Replace with actual ratings logic

        // Update customStats with the fetched data
        setCustomStats((prev) => ({
          daily: {
            ...prev.daily,
            ridesAccepted: acceptedRides.length,
            ridesDeclined: declinedRides.length,
            earnings: "R70", // Replace with actual earnings calculation
            ratings: `${driverRating}3/5`, // Use fetched driver rating
          },
          weekly: {
            ...prev.weekly,
            ridesAccepted: acceptedRides.length,
            ridesDeclined: declinedRides.length,
            earnings: "R450",
            ratings: `${driverRating}/5`,
          },
          monthly: {
            ...prev.monthly,
            ridesAccepted: acceptedRides.length,
            ridesDeclined: declinedRides.length,
            earnings: "R1800",
            ratings: `${driverRating}/5`,
          },
        }))
      } catch (error) {
        console.error("Error fetching ride stats:", error.message)
      }
    }

    if (user_id) {
      fetchRideStats()
    }
  }, [user_id])

  const startTimer = () => {
    if (!timerRef.current) {
      console.log("Starting timer with initial value:", secondsOnline);
      timerRef.current = setInterval(() => {
        setSecondsOnline((prev) => {
          const newValue = prev + 1;
          // Log every minute for debugging
          if (newValue % 60 === 0) {
            console.log("Timer running for 1 minute, current seconds:", newValue);
            console.log("Formatted time:", formatSecondsToTimeString(newValue));
          }
          return newValue;
        });
      }, 1000);
    }
  }
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }
 // In your handleGoOnline function (modified)
const handleGoOnline = async () => {
  animateButton()
  if (!user_id) return

  try {
    const response = await axios.get(`${api}getDriverState?userId=${user_id}`)
    console.log("Current driver state:", response.data)

    // Parse existing online_time from API
    const online_time = response.data.online_time || "00:00:00"
    const parsedSeconds = parseTimeStringToSeconds(online_time)
    
    // Get daily worked time from API
    const dailyWorkedSeconds = response.data.workedTime?.daily || 0
    
    // Check 12-hour limit (43,200 seconds)
    if (dailyWorkedSeconds >= 43200) {
      alert("You've reached the 12-hour daily limit. Please rest.")
      return
    }

    // Calculate remaining available seconds
    const remainingSeconds = 43200 - dailyWorkedSeconds
    if (remainingSeconds <= 0) {
      alert("Daily limit reached. System will auto-offline you soon.")
      return
    }

    // Start timer from parsed seconds
    setIsOnline(true)
    setSecondsOnline(parsedSeconds)
    startTimer()

    // Update backend with continuing time
    await axios.put(`${api}updateDriverState`, {
      user_id,
      state: "online",
      online_time: formatSecondsToTimeString(parsedSeconds),
      workedTime: { daily: dailyWorkedSeconds }
    })

    navigation.navigate("PendingRequests", {
      user_id,
      secondsOnline: parsedSeconds,
      maxSeconds: remainingSeconds // Pass remaining time to next screen
    })

  } catch (error) {
    console.error("Go online error:", error)
  }
}

  const handleGoOffline = async () => {
    animateButton()
    if (!user_id) return
  
    try {
      console.log("Going offline with seconds online:", secondsOnline);
      
      // Format the seconds to the API's expected format (HH:MM:SS)
      const formattedTime = formatSecondsToTimeString(secondsOnline);
      console.log("Formatted time for API:", formattedTime);
      
      // Calculate new worked time - only daily now
      const newWorkedTime = {
        daily: totalWorkedSeconds.daily + secondsOnline,
        // We're not tracking weekly and monthly anymore
      }
  
      await axios.put(`${api}updateDriverState`, {
        user_id,
        state: "offline",
        online_time: formattedTime, // Send in the format the API expects
        workedTime: newWorkedTime, // Save the updated worked time
      })
  
      setIsOnline(false) // Update state
      setLastOnlineDuration(secondsOnline) // Save current session as last duration
      stopTimer() // Explicitly stop the timer
  
      // Update total worked seconds - only daily now
      setTotalWorkedSeconds({
        daily: newWorkedTime.daily,
        weekly: 0, // We're not using these anymore
        monthly: 0, // We're not using these anymore
      });
  
      // Don't reset secondsOnline to 0 - keep the value for when they go online again
      // setSecondsOnline(0);
    } catch (error) {
      console.error("Failed to update driver status:", error.response?.data || error.message)
    }
  }
  
  // Add this function to format seconds to time string
  const formatSecondsToTimeString = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
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
    ]).start()
  }

  const chartData = {
    daily: {
      labels: ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
      datasets: [
        { data: [5, 8, 6, 4, 7], color: () => "#0DCAF0" },
        { data: [1, 2, 3, 2, 1], color: () => "#FF6B6B" },
      ],
      legend: ["Accepted", "Declined"],
    },
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        { data: [12, 10, 15, 14, 18, 20, 22], color: () => "#0DCAF0" },
        { data: [3, 5, 2, 4, 3, 2, 1], color: () => "#FF6B6B" },
      ],
      legend: ["Accepted", "Declined"],
    },
    monthly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        { data: [60, 70, 65, 80], color: () => "#0DCAF0" },
        { data: [15, 10, 12, 8], color: () => "#FF6B6B" },
      ],
      legend: ["Accepted", "Declined"],
    },
  }

  const earningsData = {
    labels: chartData[view].labels,
    datasets: [
      {
        data:
          view === "daily"
            ? [10, 20, 15, 25, 18]
            : view === "weekly"
              ? [100, 120, 110, 130, 125, 150, 160]
              : [400, 450, 500, 550],
        color: () => "#0DCAF0",
      },
    ],
    legend: ["Earnings"],
  }

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(13, 202, 240, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    decimalPlaces: 0,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#0DCAF0",
    },
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${remainingSeconds}s`
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0DCAF0" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBFD" />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Icon type="material-community" name="menu" color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {documentsFound ? (
          <>
       // Add this to your status card to display raw seconds
       <View style={styles.statusCard}>
  <View style={styles.statusHeader}>
    <View style={[styles.statusIndicator, isOnline ? styles.onlineIndicator : styles.offlineIndicator]} />
    <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
  </View>

  <Text style={styles.timeText}>
    {isOnline
      ? "Current Session: " + formatTime(secondsOnline)
      : "Last Session: " + formatTime(lastOnlineDuration)}
  </Text>
  
  {/* Add this to show the raw seconds */}
  <Text style={styles.rawTimeText}>
    {isOnline
      ? `(${secondsOnline} seconds)`
      : `(${lastOnlineDuration} seconds)`}
  </Text>
  
  {/* Add this to show both formats */}
  <View style={styles.timeDetailContainer}>
    <Text style={styles.timeDetailLabel}>
      {isOnline ? "Current Session Details:" : "Last Session Details:"}
    </Text>
    <Text style={styles.timeDetailValue}>
      {isOnline 
        ? `${formatSecondsToTimeString(secondsOnline)} (${secondsOnline} seconds)`
        : `${formatSecondsToTimeString(lastOnlineDuration)} (${lastOnlineDuration} seconds)`}
    </Text>
  </View>
  
  {/* Add this to show raw seconds */}
  <Text style={styles.rawTimeText}>
    {isOnline
      ? `Current seconds: ${secondsOnline}`
      : `Last session seconds: ${lastOnlineDuration}`}
  </Text>
  {/* Time Debug Section */}



</View>

            <View style={styles.toggleContainer}>
              {["daily", "weekly", "monthly"].map((timeframe) => (
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
              {Object.entries(customStats[view]).map(([key, value]) => (
                <View style={styles.statBox} key={key}>
                  <Text style={styles.statTitle}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .charAt(0)
                      .toUpperCase() +
                      key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .slice(1)}
                  </Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Ride Acceptance</Text>
              <BarChart
                data={chartData[view]}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero
                showBarTops={false}
                showValuesOnTopOfBars={false}
                withInnerLines={false}
                style={styles.chart}
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Earnings Trend</Text>
              <LineChart
                data={earningsData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                withInnerLines={false}
                style={styles.chart}
              />
            </View>
          </>
        ) : (
          <View style={styles.uploadDocumentsContainer}>
            <Icon name="file-document-outline" type="material-community" size={60} color="#0DCAF0" />
            <Text style={styles.uploadDocumentsTitle}>Documents Required</Text>
            <Text style={styles.uploadDocumentsText}>Please upload your documents to start accepting rides.</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Documents</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.goOnlineButtonContainer}>
        <Animated.View style={{ transform: [{ scale: animationValue }] }}>
          <TouchableOpacity
            style={[styles.goOnlineButton, isOnline && styles.goOfflineButton]}
            onPress={isOnline ? handleGoOffline : handleGoOnline}
          >
            <Text style={styles.goOnlineText}>{isOnline ? "Go Offline" : "Go Online"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FBFD",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FBFD",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    marginBottom: 80,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  onlineIndicator: {
    backgroundColor: "#10B981",
  },
  offlineIndicator: {
    backgroundColor: "#F43F5E",
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  timeText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 16,
  },
  timeStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeStatItem: {
    alignItems: "center",
  },
  timeStatLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  timeStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#0DCAF0",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  activeText: {
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  statTitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    marginHorizontal: -8,
  },
  goOnlineButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  goOnlineButton: {
    backgroundColor: "#0DCAF0",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#0DCAF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  goOfflineButton: {
    backgroundColor: "#F43F5E",
  },
  goOnlineText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  uploadDocumentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  uploadDocumentsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 8,
  },
  uploadDocumentsText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: "#0DCAF0",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  rawTimeText: {
    fontSize: 14,
    fontFamily: 'monospace', // For better number readability
    color: "#64748B",
    marginBottom: 16,
  },
  timeStatSeconds: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
    fontFamily: 'monospace', // Use monospace font for better readability of numbers
  },
  debugSection: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12,
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  debugLabel: {
    fontSize: 14,
    color: "#64748B",
  },
  debugValue: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#0F172A",
    fontWeight: "500",
  },
  timeDetailContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timeDetailLabel: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },
  timeDetailValue: {
    fontSize: 16,
    fontFamily: "monospace",
    color: "#0F172A",
    fontWeight: "500",
  },
  timeStatItemSingle: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Take full width
  },
})

export default DriverStats
