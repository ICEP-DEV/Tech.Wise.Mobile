import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import WebView from 'react-native-webview';

const SubscriptionPage = ({ navigation, route }) => {
  const [isFirstTime, setIsFirstTime] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [latestSubscriptionCode, setLatestSubscriptionCode] = useState(null);

  const [loading, setLoading] = useState(true);
  const userEmail = useSelector((state) => state.auth.user?.email || "");
  const user_id = useSelector((state) => state.auth.user?.user_id || "");
  const [customerId, setCustomerId] = useState(null);
  const [authorizationUrl, setAuthorizationUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState(null);
  const [selectedCost, setSelectedCost] = useState(null);
  const { status } = route.params || {}; // Provide an empty object as fallback
console.log("statusooooooooooooo", status);


  useEffect(() => {
    const fetchCustomerIdAndSubscriptions = async () => {
      const id = await fetchCustomerId(user_id);
      if (id) {
        setCustomerId(id);
        const subscriptionData = await fetchSubscriptions(id);
        setSubscription(subscriptionData);
      } else {
        // Continue with subscription if no customer ID is found
        setCustomerId(null); // Set to null
        setSubscription(null); // Proceed without subscription data
      }
      setLoading(false); // Set loading to false once data is fetched
    };

    if (user_id) {
      fetchCustomerIdAndSubscriptions();
    }
  }, [user_id]);

  const fetchCustomerId = async (user_id) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/get-customer-id?user_id=${user_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer ID");

      }

      const data = await response.json();
      return data.customer_id || null;  // Return null if no customer ID
    } catch (error) {
      Alert.alert("Choose subscription option");
      return null;
    }
  };

  const fetchSubscriptions = async (customerId) => {
    console.log("Fetching subscriptions for customer ID:", customerId);

    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/subscription?customer=${customerId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const subscriptions = await response.json();

      if (subscriptions.length > 0) {
        // Assuming there's a 'createdAt' field in the subscription object
        const latestSubscription = subscriptions.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        const latestSubscriptionCode = latestSubscription.subscription_code;


        setLatestSubscriptionCode(latestSubscriptionCode);
        console.log("Latest subscription code:", latestSubscriptionCode);
        return latestSubscriptionCode;
      } else {
        console.log("No subscriptions found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return null;
    }
  };


  const handleSubscribe = async (planType, cost) => {
    if (!userEmail) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/api/initialize-transaction-with-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          cost: cost,
          planType: planType,
          user_id: user_id,  // Include the user_id for verification
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data); // Log the backend response

      if (data.authorization_url) {
        setSelectedPlanType(planType);
        setSelectedCost(cost);
        setAuthorizationUrl(data.authorization_url);
      } else {
        Alert.alert("Error", "Failed to initialize transaction.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (authorizationUrl) {
    return (
      <WebView
        source={{ uri: authorizationUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes("payment-success")) {
            // Extract reference correctly
            const urlParams = new URLSearchParams(navState.url.split('?')[1]);
            const reference = urlParams.get('reference');

            // Ensure reference is not null
            if (reference) {
              setAuthorizationUrl(null);
              navigation.replace("PaymentSuccess", {
                planType: selectedPlanType,
                cost: selectedCost,
                reference: reference
              });
            }
          } else if (navState.url.includes("payment-error")) {
            setAuthorizationUrl(null);
            Alert.alert("Error", "Payment failed. Please try again.");
          }
        }}
      />
    );
  }


  const handleViewSubscription = () => {
    const planType = subscription?.planType || "N/A";
    const cost = subscription?.cost || 0;
    if (!latestSubscriptionCode) {
      Alert.alert("Error", "No active subscription found.");
      return;
    }

    navigation.navigate('ManageSubscription', {
      customerId: customerId,
      latestSubscriptionCode: latestSubscriptionCode
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007f7f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Subscription Plans</Text>
      <Text style={styles.description}>Choose the subscription plan that best suits your needs:</Text>

      {/* If no subscription, show subscription plans */}
      <>
        <View style={styles.detailsCard}>
          <Text style={styles.planTitle}>Weekly Subscription Plan</Text>
          <Text style={styles.detailItem}>✔ Cost: R400 / week</Text>
          <Text style={styles.detailItem}>✔ Access to premium features</Text>
          <Text style={styles.detailItem}>✔ Priority support</Text>
          <Text style={styles.detailItem}>✔ Cancel anytime</Text>

          {(!customerId || (subscription && (subscription.status === 'canceled' || status === 'non-renewing'))) && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe('Weekly', 400)}
            >
              <Text style={styles.buttonText}>Subscribe to Weekly Plan</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.planTitle}>Monthly Subscription Plan</Text>
          <Text style={styles.detailItem}>✔ Cost: R1500 / month</Text>
          <Text style={styles.detailItem}>✔ Access to premium features</Text>
          <Text style={styles.detailItem}>✔ Priority support</Text>
          <Text style={styles.detailItem}>✔ Cancel anytime</Text>

          {(!customerId || (subscription && (subscription.status === 'canceled' || status === 'non-renewing'))) && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleSubscribe('Monthly', 1500)}
            >
              <Text style={styles.buttonText}>Subscribe to Monthly Plan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* If subscription exists, show View Subscription button */}
        {subscription && (
          <TouchableOpacity
            style={styles.viewSubscriptionButton}
            onPress={handleViewSubscription}
          >
            <Text style={styles.buttonText}>View Subscription</Text>
          </TouchableOpacity>
        )}
      </>

      {/* Back to Home Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007f7f',
  },
  description: {
    fontSize: 16,
    color: '#005f5f',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007f7f',
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007f7f',
  },
  subscribeButton: {
    backgroundColor: '#40e0d0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  viewSubscriptionButton: {
    backgroundColor: '#1e90ff', // Blue for view subscription button
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#008b8b',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubscriptionPage;
