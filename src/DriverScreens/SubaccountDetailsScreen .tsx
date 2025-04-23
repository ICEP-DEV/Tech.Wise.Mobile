"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native"
import axios from "axios"
import { api } from "../../api"
import { useSelector } from "react-redux"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  Building,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react-native"

// Define theme colors
const THEME = {
  background: "#121212",
  card: "#1A1D26",
  primary: "#00D8F0", // Bright cyan
  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
  },
  success: "#4CAF50",
  error: "#F44336",
}

const SubaccountDetailsScreen = ({ navigation, route }) => {
  const [subaccountDetails, setSubaccountDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const user_id = useSelector((state) => state.auth.user?.user_id || "")

  // Function to format date to a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"

    // Format: Month Day, Year at Hour:Minute AM/PM
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Function to fetch subaccount details
  useEffect(() => {
    const fetchSubaccountDetails = async () => {
      try {
        const response = await axios.get(api + "subaccount", {
          params: { user_id },
        })

        if (response.data.subaccount) {
          setSubaccountDetails(response.data.subaccount)
        } else {
          setError("Failed to fetch subaccount details.")
        }
      } catch (err) {
        console.log("Error fetching subaccount details:", err)
        setError("Unable to load account details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchSubaccountDetails()
  }, [user_id])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft color={THEME.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={styles.loadingText}>Loading account details...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <XCircle color={THEME.error} size={60} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Account Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              {subaccountDetails.is_verified ? (
                <CheckCircle color={THEME.success} size={32} />
              ) : (
                <XCircle color={THEME.error} size={32} />
              )}
            </View>
            <Text style={styles.statusTitle}>
              {subaccountDetails.is_verified ? "Verified Account" : "Unverified Account"}
            </Text>
            <Text style={styles.statusDescription}>
              {subaccountDetails.is_verified
                ? "Your account has been verified and is ready to receive payments."
                : "Your account is pending verification. This may take 1-2 business days."}
            </Text>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Account Information</Text>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Calendar color={THEME.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Created At</Text>
                <Text style={styles.detailValue}>{formatDate(subaccountDetails.created_at)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Building color={THEME.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Business Name</Text>
                <Text style={styles.detailValue}>{subaccountDetails.business_name || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <DollarSign color={THEME.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>{subaccountDetails.currency || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Building color={THEME.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Settlement Bank</Text>
                <Text style={styles.detailValue}>{subaccountDetails.settlement_bank || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <CreditCard color={THEME.primary} size={20} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Subaccount Code</Text>
                <Text style={styles.detailValue}>{subaccountDetails.subaccount_code || "N/A"}</Text>
              </View>
            </View> */}

            {subaccountDetails.description && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailItem}>
                  <View style={styles.detailIconContainer}>
                    <CreditCard color={THEME.primary} size={20} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={styles.detailValue}>{subaccountDetails.description}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("AddPaymentMethodScreen")}>
            <Text style={styles.actionButtonText}>Replace card</Text>
            <ChevronRight color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 216, 240, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: THEME.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: THEME.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 216, 240, 0.3)",
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME.text.primary,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: THEME.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0, 216, 240, 0.3)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.text.primary,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 216, 240, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: THEME.text.primary,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  actionButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
})

export default SubaccountDetailsScreen
