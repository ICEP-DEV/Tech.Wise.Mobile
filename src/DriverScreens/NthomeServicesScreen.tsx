import React from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import ServiceCard from "../components/ServiceCard"

const { width } = Dimensions.get("window")

const NthomeServicesScreen = () => {
  return (
    <LinearGradient colors={["#999", "#333", "#fff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Nthome Services</Text>
        <ServiceCard title="NthomeRides" description="Your reliable ride, anytime, anywhere." isComingSoon={false} />
        <ServiceCard title="NthomeAir" description="Elevate your travel experience." isComingSoon={true} />
        <ServiceCard
          title="NthomeFood"
          description="Delicious meals, delivered to your doorstep."
          isComingSoon={true}
        />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 30,
    textAlign: "center",
  },
})

export default NthomeServicesScreen
