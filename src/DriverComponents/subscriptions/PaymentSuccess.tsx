import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const PaymentSuccess = ({ route, navigation }) => {
  const { planType, cost, reference } = route.params;
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [latestSubscriptionCode, setLatestSubscriptionCode] = useState(null);



  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        console.log("Verifying transaction with reference:", reference);

        const response = await axios.post("http://10.0.2.2:3000/api/payment-callback", {
          reference,
        });

        console.log("Transaction Verification Response:", response.data);

        if (response.data.success) {
          setTransaction(response.data.transactionDetails);
        } else {
          console.error("Transaction failed:", response.data.error);
          setTransaction(null);
        }
        fetchSubscriptions();
      } catch (error) {
        console.error("Error verifying transaction:", error);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [reference, planType]);

  const fetchSubscriptions = async () => {
    const customer_id = transaction.customerId
    console.log("Fetching subscriptions for customer ID:", customer_id);
  
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/subscription?customer=${customer_id}`
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
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : transaction ? (
        <>
          <Text style={styles.message}>
            Thank you, {transaction.first_name} {transaction.last_name}, for subscribing to the {transaction.name} plan.
          </Text>
          <Text style={styles.details}>Plan: {transaction.name}</Text>
          <Text style={styles.details}>Description: {transaction.description}</Text>
          <Text style={styles.details}>Amount: R{transaction.amount}</Text>
          <Text style={styles.details}>Interval: {transaction.interval}</Text>
          <Text style={styles.details}>Paid At: {new Date(transaction.paidAt).toLocaleString()}</Text>
          <Text style={styles.details}>Card Last 4 Digits: **** **** **** {transaction.last4}</Text>
          <Text style={styles.details}>Payment Status: {transaction.status}</Text>
          <Text style={styles.details}>Reference ID: {transaction.reference}</Text>
          <Text style={styles.details}>customer ID: {transaction.customerId}</Text>
          <Text style={styles.details}>customer code: {transaction.customer_code}</Text>
        </>
      ) : (
        <Text style={styles.errorText}>Error verifying subscription details.</Text>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Subscriptions", {
          // customerId: transaction.customerId,
          // interval: transaction.interval,
          // latestSubscriptionCode: latestSubscriptionCode,
        })}
      >
        <Text style={styles.buttonText}>View subscription</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default PaymentSuccess;
