"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Animated } from "react-native"
import { Icon } from "react-native-elements"
import { colors } from "../global/styles"
import MapComponent from "../components/MapComponent"
import * as Location from "expo-location"
import { SafeAreaView } from "react-native-safe-area-context"
import { db } from "../../FirebaseConfig"
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore"
import { useDispatch, useSelector } from "react-redux"
import {
  connectSocket,
  listenToNewTripRequests,
  emitStartTrip,
  emitEndTrip,
  emitArrival,
  emitCancelTrip,
  listenCancelTrip,
  listenToChatMessages,
} from "../configSocket/socketConfig" // import your socket functions
import axios from "axios"
import { api } from "../../api"
import TripCancellationModal from "../components/TripCancelationModal"
import { setTripData } from "../redux/actions/tripActions"
import { setMessageData } from "../redux/actions/messageAction"
import { formatTime } from "../utils/timeTracker"

const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width
// Define theme colors
const THEME = {
  background: "#121212",
  card: "#1A1D26",
  primary: "#00D8F0", // Bright cyan
  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
  },
}
export default function PendingRequests({ navigation, route }) {
  const dispatch = useDispatch() // Redux dispatch function
  const user = useSelector((state) => state.auth.user)
  const user_id = user?.user_id || null
  const [tripStarted, setTripStarted] = useState(false)

  // const openDrawer = route.params?.openDrawer
  // const state = route.params?.newState
  // console.log(state, "state from pending requests")
  // console.log(openDrawer, "openDrawer from pending requests")

  //from TripRequestModal
  // const tripAccepted = route.params?.tripAccepted
  //from TrpRequestModal
  const tripData = route.params?.tripData
  useEffect(() => {
    if (tripData) {
      console.log("✅ tripId:", tripData.id) // 'id' is tripId
      console.log("✅ customerId:", tripData.customerId)
    } else {
      console.log("❌ tripData is undefined")
    }
  }, [])

  // console.log("Received tripData from route params:", tripData)

  const [tripRequestSocket, setTripRequest] = useState(tripData)
  // const tripRequestSocket = useSelector((state) => state.trip.tripData)

  const [eta, setEta] = useState("N/A")
  const [distance, setDistance] = useState("N/A")
  const [showStartButton, setShowStartButton] = useState(false)
  const [showEndButton, setShowEndButton] = useState(false)
  const [distanceTraveld, setDistanceTraveld] = useState("N/A")
  const [messages, setMessages] = useState([])

  // console.log("Trip ID from Redux:", trip_id);
  // Timer state and ref
  const [secondsOnline, setSecondsOnline] = useState(0)
  // const timerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const [remainingTime, setRemainingTime] = useState(0)

  useEffect(() => {
    axios
      .get(api + `/driver/remainingTime/${user_id}`)
      .then((res) => {
        setRemainingTime(res.data.remainingSeconds)
        startCountdown(res.data.remainingSeconds)
      })
      .catch((err) => console.error(err, "-----------------"))
  }, [user_id])
  // Timer functions

  const startCountdown = (initialSeconds) => {
    let seconds = initialSeconds
    const interval = setInterval(() => {
      seconds--
      setRemainingTime(seconds)
      if (seconds <= 0) {
        clearInterval(interval)
        handleGoOffline()
      }
    }, 1000)
  }
  const timerRef = useRef(null) // ref to hold the timer id

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearInterval(timerRef.current) // cleanup on unmount
  }, [])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null // optional: clear ref so it can't clear again
      console.log("Timer stopped")
    }
  }

  //go online button and offline button
  const handleGoOffline = async () => {
    // clearInterval(timer); // <- clear the countdown interval
    animateButton()
    const session_id = route.params?.session_id // get session_id from navigation params
    if (!user_id ) {
      console.warn("Missing user_id or session_id")
      return
    }

    try {
      // Fetch current driver state before updating
      console.log("Fetching current driver state...")

      const fetchResponse = await axios.get(`${api}getDriverState?userId=${user_id}`)
      const currentState = fetchResponse.data.state

      if (currentState === "online") {
        const newState = "offline"
        console.log("Driver is online, setting to offline...")

        const updateResponse = await axios.put(`${api}updateDriverState`, {
          user_id,
          state: newState,
          onlineDuration: secondsOnline,
          last_online_timestamp: new Date().toISOString(),
        })

        if (updateResponse.status === 200) {
          console.log("Driver state updated to offline.")

          // ✅ ADD: Update driver_session end_time by session_id
          try {
            console.log("Updating driver_session end_time...")

            const sessionUpdateResponse = await axios.put(`${api}endDriverSession`, {
              session_id, // pass session_id
              end_time: new Date().toISOString(),
              workedSeconds: secondsOnline,
            })

            if (sessionUpdateResponse.status === 200) {
              console.log("Driver session end_time stored successfully for session_id:", session_id)
            } else {
              console.warn("Failed to store end_time in driver_session. Status:", sessionUpdateResponse.status)
            }
          } catch (sessionError) {
            console.error("Error updating driver_session:", sessionError.response?.data || sessionError.message)
          }

          setIsOnline(false)
          stopTimer() // Stop the timer when going offline

          console.log("Driver is now offline navigating.", secondsOnline)

          // ✅ Redirect AFTER storing end_time
          navigation.navigate("DriverStats", {
            user_id,
            session_id,
            workedSeconds: secondsOnline,
            state: newState,
          })
        } else {
          console.warn("Failed to update driver state. Status:", updateResponse.status)
        }
      } else {
        // If driver is offline, set them to online
        const updateResponse = await axios.put(`${api}updateDriverState`, {
          user_id,
          state: "online",
          onlineDuration: 0,
        })

        if (updateResponse.status === 200) {
          setIsOnline(true)
          setSecondsOnline(0)
          console.log("Driver is now online.")
          navigation.navigate("PendingRequests", { user_id, session_id })
        } else if (updateResponse.status === 403) {
          alert("You have reached the 12-hour daily limit. Please try again tomorrow.")
        }
      }
    } catch (error) {
      console.error("Failed to update driver status:", error.response?.data || error.message)
    }
  }

  // Extracting user origin and destination from tripData
  const [userOrigin, setUserOrigin] = useState({
    latitude: tripData?.pickUpCoordinates?.latitude ?? 0,
    longitude: tripData?.pickUpCoordinates?.longitude ?? 0,
  })

  const [userDestination, setUserDestination] = useState({
    latitude: tripData?.dropOffCoordinates?.latitude ?? 0,
    longitude: tripData?.dropOffCoordinates?.longitude ?? 0,
  })

  // socket notifications
  useEffect(() => {
    if (!user_id) return

    const userType = "driver"
    connectSocket(user_id, userType) // Ensure the driver is connected

    listenToNewTripRequests((tripData) => {
      if (!tripData) {
        console.error("❌ tripData is undefined or null on frontend!")
        return
      }

      // Show an alert
      alert(`New Trip Request Received!`)
      console.log("Trip request received:", tripData)

      // Increment notification count - ensure this runs
      setNotificationCount((prevCount) => {
        console.log("Incrementing notification count from", prevCount, "to", prevCount + 1)
        return prevCount + 1
      })

      // Store the trip data
      setTripRequest(tripData)

      // Dispatch user details to Redux
      dispatch(
        setTripData({
          id: tripData.id, // Make sure we're using the correct property
          customer_id: tripData.customerId,
        }),
      )
    })

    listenCancelTrip((tripData) => {
      setUserOrigin({ latitude: null, longitude: null })
    })

    listenToChatMessages((messageData) => {
      // Increment notification count
      setNotificationCountChat((prevCount) => prevCount + 1)
      dispatch(
        setMessageData({
          message: messageData.message,
        }),
      )
    })
  }, [user_id])

  //setting user origin and destination from socket
  useEffect(() => {
    if (tripRequestSocket?.pickUpLocation) {
      setUserOrigin({
        latitude: tripRequestSocket.pickUpLatitude,
        longitude: tripRequestSocket.pickUpLongitude,
      })
    }

    if (tripRequestSocket?.dropOffLocation) {
      setUserDestination({
        latitude: tripRequestSocket.dropOffLatitude,
        longitude: tripRequestSocket.dropOffLongitude,
      })
    }
  }, [tripRequestSocket])

  const [driverLocation, setDriverLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  //driver location
  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.error("Permission to access location was denied")
        return
      }

      const watchId = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 20000,
          distanceInterval: 1,
        },
        async (position) => {
          const { latitude, longitude } = position.coords
          setDriverLocation({ latitude, longitude })

          try {
            const driverLocationRef = doc(db, "driver_locations", user_id.toString())
            await setDoc(
              driverLocationRef,
              {
                userId: user_id,
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
              },
              { merge: true },
            )

            // console.log('Driver location saved successfully!');
          } catch (error) {
            console.log("Error saving driver location:", error)
          }
        },
      )

      return () => {
        watchId.remove()
      }
    })()
  }, [user_id])

  // Haversine formula for distance calculation
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000 // Earth radius in meters
    const toRadians = (angle) => (angle * Math.PI) / 180

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  // Function to estimate ETA (assuming an average speed of 40 km/h or 11.11 m/s)
  const estimateETA = (distanceInMeters, speedInMps = 11.11) => {
    const timeInSeconds = distanceInMeters / speedInMps
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes} min ${seconds} sec`
  }

  const [animationValue] = useState(new Animated.Value(1))
  const [isOnline, setIsOnline] = useState(true)
  const [bellAnimation] = useState(new Animated.Value(1))
  const [notificationCount, setNotificationCount] = useState(0)
  const [notificationCountChat, setNotificationCountChat] = useState(0)
  // Trip Cancellation Modal
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [tripStatusAccepted, setTripStatusAccepted] = useState(null)

  const handleCancelTrip = () => {
    setCancelModalVisible(true) // Show cancellation modal
  }
  const handleCloseModal = () => {
    setCancelModalVisible(false) // Close modal
  }
  // Fetch trip statuses
  useEffect(() => {
    const fetchTripStatuses = async () => {
      if (!user_id) return

      try {
        const response = await axios.get(`${api}trips/statuses/${user_id}`)
        if (response.status === 200) {
          // console.log("🚀 Trip statuses fetched:", response.data.latestTrip?.statuses);
          setTripStatusAccepted(response.data.latestTrip?.statuses)
        }
      } catch (error) {
        console.error("⚠️ Error fetching trip statuses:", error)
      }
    }

    fetchTripStatuses()
    // console.log("Trip Status Accepted:", tripStatusAccepted);

    const intervalId = setInterval(fetchTripStatuses, 5000) // Fetch every 5 seconds

    return () => clearInterval(intervalId) // Cleanup interval on unmount
  }, [user_id])

  const handleCancel = async (reason) => {
    setCancelReason(reason)
    // console.log("Trip Cancelled for reason:", tripRequestSocket?.id);

    // Assuming you have the tripId, cancel_by (user ID or admin), and distance_traveled (if applicable)
    const tripId = tripRequestSocket?.id // Replace with the actual trip ID you want to cancel
    const distanceTraveled = null // Replace with the actual distance if relevant

    try {
      const response = await fetch(`${api}trips/${tripId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "canceled",
          cancellation_reason: reason,
          cancel_by: "customer",
          distance_traveled: distanceTraveled,
        }),
      })

      const responseData = await response.json()
      console.log("Response:", responseData)

      if (response.ok) {
        console.log("Trip successfully canceled.")
        setUserOrigin({ latitude: null, longitude: null })
        emitCancelTrip(tripId, tripRequestSocket.customerId)
        navigation.navigate("PendingRequests")
      } else {
        console.error("Failed to update trip:", responseData.message)
        alert(responseData.message || "Error updating trip status")
      }
    } catch (error) {
      console.error("Error canceling the trip:", error)
    }
  }

  //if trip is declined it should reset user origin
  useEffect(() => {
    if (tripStatusAccepted === "declined") {
      setUserOrigin({ latitude: null, longitude: null })
    }
  }, [tripStatusAccepted])

  //animated button
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
  //animated bell
  const animateBell = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnimation, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bellAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  // Check driver state on component mount and start timer if online
  useEffect(() => {
    const checkDriverState = async () => {
      if (!user_id) return

      try {
        const response = await axios.get(`${api}getDriverState?userId=${user_id}`)
        const { state } = response.data

        if (state === "online") {
          setIsOnline(true)
          // startTimer() // Start the timer if driver is already online
        } else {
          setIsOnline(false)
          stopTimer() // Stop the timer if driver is offline
        }
      } catch (error) {
        console.error("Error fetching driver state:", error.message)
      }
    }

    checkDriverState()

    stopTimer() // Stop the timer when component mounts
  }, [user_id])

  //update notifications to pending from firebase
  useEffect(() => {
    animateBell()
  }, [])

  //update notifications to pending from firebase
  useEffect(() => {
    const driverId = user_id
    const tripsRef = collection(db, "trips")
    const q = query(tripsRef, where("driverId", "==", driverId))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let count = 0
      querySnapshot.forEach(() => {
        count++
      })
      setNotificationCount(count)
    })

    return () => unsubscribe()
  }, [])

  //update notifications to pending from firebase
  const handleNotificationClick = () => {
    if (notificationCount > 0) {
      setNotificationCount(notificationCount - 1) // Decrease notification count on click
    }
    navigation.navigate("PendingTripsBottomSheet", { tripAccepted: true })
  }

  useEffect(() => {
    animateBell() // Start bell animation when component mounts
  }, [])

  // Start Button (Driver → Pickup Location)
  useEffect(() => {
    const fetchRouteDetails = () => {
      if (!userOrigin.latitude || !driverLocation.latitude || !userDestination.latitude) return

      // Calculate distance using Haversine function from Driver to Pickup Location
      const distanceToPickupInMeters = haversineDistance(
        driverLocation.latitude,
        driverLocation.longitude,
        userOrigin.latitude,
        userOrigin.longitude,
      )

      // Calculate distance using Haversine function from Pickup Location to Dropoff Location (userDestination)
      const distanceToDestinationInMeters = haversineDistance(
        userOrigin.latitude,
        userOrigin.longitude,
        userDestination.latitude,
        userDestination.longitude,
      )

      // Estimate ETA based on whether the startButton is clicked or not
      if (showStartButton) {
        // Estimate ETA for Destination
        const etaValueForDestination = estimateETA(distanceToDestinationInMeters)
        setEta(etaValueForDestination)
        setDistance(`${(distanceToDestinationInMeters / 1000).toFixed(2)}`)
      } else {
        // Estimate ETA for Pickup Location
        const etaValueForPickup = estimateETA(distanceToPickupInMeters)
        setEta(etaValueForPickup)
        setDistance(`${(distanceToPickupInMeters / 1000).toFixed(2)}`)
      }

      // Check if driver is within 5 m of pickup location
      const distanceInMetersRandom = 50
      if (distanceToPickupInMeters <= distanceInMetersRandom) {
        console.log("Driver is within 5km of pickup location")
        setShowStartButton(true)
        emitArrival(tripRequestSocket.id, tripRequestSocket.customerId)
      }

      // Optionally handle distance to destination if needed
      // console.log(`Distance to destination: ${(distanceToDestinationInMeters / 1000).toFixed(2)} km`);
    }

    fetchRouteDetails()
  }, [userOrigin, driverLocation, userDestination, showStartButton])

  // End Button (Pickup → Destination)
  useEffect(() => {
    const fetchRouteDetails = () => {
      if (!userOrigin.latitude || !userDestination.latitude) return

      // Calculate distance using Haversine function
      const distanceInMeters = haversineDistance(
        userOrigin.latitude,
        userOrigin.longitude,
        userDestination.latitude,
        userDestination.longitude,
      )

      // Estimate ETA
      const etaValue = estimateETA(distanceInMeters)

      setEta(etaValue)
      setDistanceTraveld(`${(distanceInMeters / 1000).toFixed(2)} km`)

      // Show End button if driver is within 50cm (0.5m) of destination
      setShowEndButton(distanceInMeters <= 50)
    }

    fetchRouteDetails()
  }, [userOrigin, userDestination])

  //update trip and notify customer when driver clicks start trip
  const handleStartTrip = async () => {
    try {
      // 1️⃣ Update trip status
      const response = await fetch(`${api}trips/${tripData.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "on-going",
          cancellation_reason: null,
          cancel_by: null,
          distance_traveled: distance,
        }),
      })

      if (!response.ok) throw new Error("Error updating trip status")

      // 2️⃣ Update payment status to success
      const paymentResponse = await fetch(`${api}payments/user/${tripData.customerId}/trip/${tripData.id}/status`, {
        method: "PUT",
      })

      if (!paymentResponse.ok) throw new Error("Error updating payment status")

      console.log("Payment status updated to success")

      // 3️⃣ Alert customer
      emitStartTrip(tripData.id, tripData.customerId)
      setTripStarted(true) // Set tripStarted to true
      console.log("Trip successfully started.", tripStarted)
    } catch (error) {
      console.error("Error starting trip:", error)
    }
  }

  //update trip and notify customer when driver clicks end trip
  const handleEndRide = async () => {
    try {
      // Ensure tripData.id exists before making the request
      if (!tripData?.id) {
        console.error("Trip ID is missing.")
        return
      }

      // Make an API request to update the trip status to "completed"
      const response = await fetch(`${api}trips/${tripData.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          distance_traveled: distance, // Ensure this is being captured correctly
        }),
      })

      if (!response.ok) throw new Error("Error updating trip status")

      // Notify customer that the trip has ended
      emitEndTrip(tripData.id, tripData.customerId)

      // Clear everything on both screens
      setTripStarted(false)
      setUserOrigin({ latitude: null, longitude: null })
      setUserDestination({ latitude: null, longitude: null })
      setShowStartButton(false)
      setShowEndButton(false)
      setEta("N/A")
      setDistance("N/A")
      setDistanceTraveld("N/A")
      setTripRequest(null)

      // Recenter the map on driver's current location
      if (mapRef && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        })
      }

      console.log("Trip successfully ended and screens cleared.")
    } catch (error) {
      console.error("Error ending trip:", error)
    }
  }
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }
  // Add a mapRef to access the map from MapComponent
  const mapRef = useRef(null)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
            <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
              <Icon type="material-community" name="menu" color="#0F172A" size={24} />
            </TouchableOpacity>
            {/* <Text style={styles.headerTitle}>Driver Dashboard</Text> 
            <View style={{ width: 40 }} />
          </View> */}

      {/* Update the MapComponent to pass the ref */}
      <MapComponent
        driverLocation={driverLocation}
        userOrigin={userOrigin}
        userDestination={userDestination}
        tripStart={tripStarted}
        mapRef={mapRef}
      />

      {/* Timer display */}
      <View style={styles.timerContainer}>
        {/* <Text style={styles.timerText}>Online Time: {formatTime(secondsOnline)}</Text> */}
        <Text style={styles.timerText}>Remaining Time: {formatTime(remainingTime)}</Text>
      </View>

      <Animated.View style={{ transform: [{ scale: animationValue }] }}>
        <TouchableOpacity style={styles.goOnlineButton} onPress={handleGoOffline}>
          <Text style={styles.goOnlineText}>{isOnline ? "OFF" : "GO"}</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("CustomerCommunicationBottomSheet", {
              tripId: tripData.id,
              customerId: tripData.customerId,
            })
          }
        >
          <Icon type="material-community" name="phone" color="#FFFFFF" size={24} />
          {notificationCountChat > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCountChat}</Text>
            </View>
          )}
        </TouchableOpacity>

        <Animated.View style={[{ transform: [{ scale: bellAnimation }] }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleNotificationClick}>
            <Icon type="material-community" name="bell" color="#FFFFFF" size={24} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
        {tripStatusAccepted === "accepted" && (
          <TouchableOpacity style={styles.actionButton} onPress={handleCancelTrip}>
            <Icon type="material-community" name="close-circle" color="#FFFFFF" size={24} />
          </TouchableOpacity>
        )}
      </View>
      {/* <Text>ETA: {eta}</Text>
      <Text>Distance: {distance}</Text> */}
      {showStartButton && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartTrip}>
          <Text style={styles.buttonText}>Start Trip</Text>
        </TouchableOpacity>
      )}

      {showEndButton && (
        <TouchableOpacity style={styles.endRideButton} onPress={handleEndRide}>
          <Text style={styles.endRideButtonText}>End Ride</Text>
        </TouchableOpacity>
      )}

      {/* Trip Cancellation Modal */}
      <TripCancellationModal isVisible={cancelModalVisible} onClose={handleCloseModal} onCancel={handleCancel} />
      {/* <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: parameters.statusBarHeight,
    backgroundColor: colors.white,
  },
  view1: {
    position: "absolute",
    top: 25,
    left: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    zIndex: 10,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 70,
    right: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    zIndex: 10,
  },
  profilePicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  goOnlineButton: {
    position: "absolute",
    bottom: 130, // Adjust as needed
    left: SCREEN_WIDTH / 2 - 30, // Center the button horizontally
    backgroundColor: "#0DCAF0", // Updated to the requested color
    borderRadius: 30, // Circular shape
    width: 60, // Diameter
    height: 60, // Diameter
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    elevation: 5, // Shadow effect for Android
    shadowColor: "#0DCAF0", // Shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  goOnlineText: {
    color: "#fff", // Text color
    fontSize: 24, // Font size for "GO"
    fontWeight: "bold", // Bold text
  },
  bellContainer: {
    position: "absolute",
    top: 120,
    right: 20,
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  header: {
    position: "absolute", // Ensures it floats on top of the screen
    top: 60, // Adjust for slight padding at the top
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
  startButton: {
    position: "absolute",
    bottom: 200, // Adjust as needed
    left: SCREEN_WIDTH / 2 - 70, // Center the button horizontally
    backgroundColor: "#0DCAF0", // Updated to the requested color
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Space between buttons
    flexDirection: "row",
    shadowColor: "#0DCAF0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  endRideButton: {
    position: "absolute",
    bottom: 200, // Adjust as needed
    left: SCREEN_WIDTH / 2 - 70, // Center the button horizontally
    backgroundColor: "#FF6B6B", // Red color for end button
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff", // White text color for both buttons
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  endRideButtonText: {
    color: "#fff", // White text for end button
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 25,
    right: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    zIndex: 10,
  },
  timerContainer: {
    position: "absolute",
    top: 30,
    left: "40%",
    transform: [{ translateX: -100 }], // Adjust -100 based on your view's approximate width
    backgroundColor: "#1A1D26",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 216, 240, 0.3)",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  timerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0DCAF0",
    marginLeft: 8,
  },
  cancelButtonContainer: {
    top: 140, // Adjust this to position the cancel button below the call button
    right: 12, // Same alignment as the call button
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    left: 10,
  },
  infoContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "500",
  },
  actionButtonsContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 8,
  },
})
