import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator
} from "react-native"
import { Icon } from "react-native-elements"
import CustomDrawer from "../components/CustomDrawer"
import axios from "axios"
import { api } from "../../api"
import { useSelector } from "react-redux"

const TripHistory = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("completed")
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const driverId = useSelector((state) => state.auth.user?.user_id || "")

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${api}allTrips?status=${activeTab}&driverId=${driverId}`)
        setTrips(response.data)
      } catch (error) {
        console.error("Error fetching trips:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [activeTab])

  const navigateToDetails = (trip) => {
    navigation.navigate("TripDetails", { trip })
  }

  const renderTripItem = ({ item }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => navigateToDetails(item)} activeOpacity={0.8}>
      <View style={styles.tripHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.tripDate}>{new Date(item.requestDate).toLocaleDateString()}</Text>
          <Text style={styles.tripTime}>{new Date(item.requestDate).toLocaleTimeString()}</Text>
        </View>
        {activeTab === "completed" ? (
          <View style={styles.costContainer}>
            <Text style={styles.costLabel}>Status</Text>
            <Text style={styles.costValue}>{item.payment_status}</Text>
          </View>
        ) : (
          <View style={styles.canceledBadge}>
            <Text style={styles.canceledText}>Canceled</Text>
          </View>
        )}
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationText}>{item.pickUpLocation}</Text>
            </View>
          </View>
          <View style={styles.locationLine} />
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationText}>{item.dropOffLocation}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tripFooter}>
        <View style={styles.passengerContainer}>
          <Icon name="account" type="material-community" size={16} color="#64748B" />
          <Text style={styles.passengerName}>Customer #{item.customerId}</Text>
        </View>

        {activeTab === "completed" && (
          <View style={styles.ratingContainer}>
            <Icon name="star" type="material-community" size={16} color="#FACC15" />
            <Text style={styles.ratingText}>{item.customer_rating}</Text>
          </View>
        )}

        {activeTab === "canceled" && <Text style={styles.reasonText}>{item.cancellation_reason}</Text>}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBFD" />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Icon type="material-community" name="menu" color="#0F172A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip History</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          style={[styles.tabButton, activeTab === "completed" && styles.activeTabButton]}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>Completed</Text>
          {activeTab === "completed" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("canceled")}
          style={[styles.tabButton, activeTab === "canceled" && styles.activeTabButton]}
        >
          <Text style={[styles.tabText, activeTab === "canceled" && styles.activeTabText]}>Canceled</Text>
          {activeTab === "canceled" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0F172A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTripItem}
          contentContainerStyle={styles.tripsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="car-off" type="material-community" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No {activeTab} trips found</Text>
            </View>
          }
        />
      )}

      <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} navigation={navigation} />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FBFD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  tabButton: {
    paddingVertical: 16,
    marginRight: 24,
    position: "relative",
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#0DCAF0",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#0DCAF0",
    fontWeight: "600",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#0DCAF0",
  },
  tripsList: {
    padding: 20,
    paddingTop: 12,
  },
  tripCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dateContainer: {},
  tripDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4,
  },
  tripTime: {
    fontSize: 14,
    color: "#64748B",
  },
  costContainer: {
    alignItems: "flex-end",
  },
  costLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  costValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0DCAF0",
  },
  canceledBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  canceledText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  tripDetails: {
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#0DCAF0",
    marginTop: 4,
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: "#F43F5E",
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: "#CBD5E1",
    marginLeft: 5,
    marginBottom: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  passengerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passengerName: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCE8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#854D0E",
    marginLeft: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#64748B",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default TripHistory
