import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import WebView from 'react-native-webview';


const ManageSubscription = ({ navigation, route }) => {
  const { customerId, interval , latestSubscriptionCode } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [isWebViewVisible, setIsWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const userId = useSelector((state) => state.auth.user?.user_id || "");
  const email = useSelector((state) => state.auth.user?.email || "");
    // console.log("latestSubscription77777777777777777777",latestSubscriptionCode, customerId );
    const [emailToken, setEmailToken] = useState(null);
 
    useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        console.log("Fetching subscriptions for customer ID:", customerId, latestSubscriptionCode);

        const response = await fetch(
          `http://10.0.2.2:3000/api/subscription?customer=${customerId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }

        const subscriptions = await response.json();
        // console.log("Fetched Subscriptions66666666666666666666666666666:", subscriptions[0].email_token);

        if (subscriptions.length > 0) {
          setSubscription(subscriptions[0]); // Assuming you want the first subscription
          setEmailToken(subscriptions[0].email_token); // Store email_token
        } else {
          setSubscription(null);
          console.log("No active subscriptions found for the customer.");
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (customerId) {
      fetchSubscriptions();
    }
  }, [customerId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleUpdateCard = async () => {
    setIsLoading(true);
    try {
        const response = await axios.post('http://10.0.2.2:3000/api/update-payment-method', {
            email,
            subscription_code: latestSubscriptionCode,
        });

        const paystackLink = response.data.link;

        if (paystackLink) {
            Linking.openURL(paystackLink); // Open Paystack page
            navigation.navigate('Subscriptions' );
        } else {
            Alert.alert('Error', 'Could not get update link.');
        }
    } catch (error) {
        Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
    }
    setIsLoading(false);
};

  

const handleUpgrade = async () => {
  setIsLoading(true);
  try {
    if (!subscription || !subscription.subscription_code || !emailToken) {
      Alert.alert('Error', 'Invalid subscription details.');
      console.log('Subscription Code:', subscription?.subscription_code || 'N/A');
      console.log('Email Token:', emailToken || 'N/A');
      setIsLoading(false);
      return;
    }

    console.log("Cancelling subscription for code:", subscription.subscription_code);

    const cancelResponse = await axios.post('http://10.0.2.2:3000/api/cancel-subscription', {
      code: subscription.subscription_code,
      token: emailToken,
    });

    console.log("Cancel response:", cancelResponse.data);

    if (cancelResponse.status === 200) {
      const { message } = cancelResponse.data;

      if (message === 'Subscription is non-renewing and will expire at the end of the term') {
        // Navigate to Subscriptions page if the subscription is non-renewing
        Alert.alert('Info', 'Your subscription is set to expire at the end of the term.');
        navigation.navigate('Subscriptions', { status: 'non-renewing' });  // Pass 'status' as param
      } else {
        Alert.alert('Success', 'Subscription canceled. Please choose a new plan.');
        navigation.navigate('Subscriptions');
      }
    } else {
      Alert.alert('Error', cancelResponse.data?.message || 'Failed to cancel the current subscription.');
    }
  } catch (error) {
    console.error('Error upgrading subscription:', error);

    if (error.response) {
      console.log('Error Response:', error.response.data);

      if (error.response.data?.message?.includes("Subscription is non-renewing")) {
        Alert.alert("Info", "Your subscription is already set to expire at the end of the term.");
        navigation.navigate('Subscriptions', { status: 'non-renewing' });  // Navigate here for non-renewing status
      } else {
        Alert.alert('Error', error.response.data?.message || 'Something went wrong. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Network error or server is unreachable.');
    }
  } finally {
    setIsLoading(false);
  }
};





const handleDowngrade = async () => {
  try {
    // Send request to cancel current subscription before downgrading
    const cancelResponse = await axios.post('http://10.0.2.2:3000/api/cancel-subscription', {
      code: latestSubscriptionCode,  // Pass the current subscription code
      token: subscription.email_token,       // Pass the email token
    });

    if (cancelResponse.status === 200) {
      const { message } = cancelResponse.data;

      // If the subscription is non-renewing, navigate to Subscriptions
      if (message === 'Subscription is non-renewing and will expire at the end of the term') {
        navigation.navigate('Subscriptions');
      } else {
        // Proceed with the downgrade if cancellation is successful
        // const response = await axios.put('http://10.0.2.2:3000/api/downgrade-subscription', {
        //   userId: subscription.user_id,
        //   newPlanName: 'Weekly',
        //   newAmount: 400,
        // });
        // setSubscription(response.data.subscription);
      }
    } else {
      // If cancellation fails, show an alert
      Alert.alert('Error', 'Failed to cancel the current subscription.');
    }
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Subscription</Text>
      <Text style={styles.description}>Modify your subscription preferences below.</Text>

      {isWebViewVisible ? (
        <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
      ) : (
        <View style={styles.subscriptionContainer}>
          {subscription ? (
            <>
              <Text style={styles.message}>
                {subscription.customer.first_name} {subscription.customer.last_name}, you subscribed to the {subscription.plan.name} plan.
              </Text>
              <Text style={styles.details}>Plan: <Text style={styles.boldText}>{subscription.plan.name}</Text></Text>
              <Text style={styles.details}>Description: {subscription.plan.description}</Text>
              <Text style={styles.details}>Amount: R<Text style={styles.boldText}>{(subscription.amount / 100).toFixed(2)}</Text></Text>
              <Text style={styles.details}>Interval: <Text style={styles.boldText}>{subscription.plan.interval}</Text></Text>
              <Text style={styles.details}>Paid At: <Text style={styles.boldText}>{new Date(subscription.createdAt).toLocaleString()}</Text></Text>
              <Text style={styles.details}>Card Last 4 Digits: <Text style={styles.boldText}>**** **** **** {subscription.authorization.last4}</Text></Text>
              <Text style={styles.details}>Payment Status: <Text style={styles.boldText}>{subscription.status}</Text></Text>
              <Text style={styles.details}>Reference ID: <Text style={styles.boldText}>{subscription.subscription_code}</Text></Text>
              <Text style={styles.details}>Customer ID: <Text style={styles.boldText}>{subscription.customer.id}</Text></Text>

              <TouchableOpacity style={styles.optionButton} onPress={handleUpdateCard}>
                <Text style={styles.buttonText}>Update subscription methods </Text>
              </TouchableOpacity>

              {subscription.plan.interval === "weekly" ? (
                <TouchableOpacity style={styles.optionButton} onPress={handleUpgrade}>
                  <Text style={styles.buttonText}>Upgrade to Monthly</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.optionButton} onPress={handleDowngrade}>
                  <Text style={styles.buttonText}>Downgrade to Weekly</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.description}>No subscription details available.</Text>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // A softer background
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333', // Darker title color
  },
  description: {
    fontSize: 18, // Larger description
    color: '#555555', // Darker description color
    marginBottom: 30,
    textAlign: 'center',
  },
  subscriptionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff', // White container
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // for Android
  },
  message: {
    fontSize: 16,
    color: '#444444',
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 24, // Improved readability
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333333',
  },
  optionButton: { backgroundColor: '#10e0d0', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  subscribeNowButton: { backgroundColor: '#20b2aa', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  backButton: { backgroundColor: '#007f7f', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default ManageSubscription;
