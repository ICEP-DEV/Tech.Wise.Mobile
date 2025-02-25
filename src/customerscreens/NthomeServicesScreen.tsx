import React from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import ServiceCard from "../components/ServiceCard"

const { width } = Dimensions.get("window")

const NthomeServicesScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Nthome Services</Text>
      <Text style={styles.description}>
          At Nthome, we are committed to transforming everyday convenience through technology-driven services that simplify your life.
          Whether you need a quick and safe ride, seamless air travel, or delicious meals delivered to your doorstep, we strive to 
          provide reliable, affordable, and high-quality solutions. As we expand, we continue to innovate and improve, bringing you 
          the best in mobility, travel, and dining experiences.
        </Text>
        
        <ServiceCard title="NthomeRides" description="Your reliable ride, anytime, anywhere." isComingSoon={false} />
        <ServiceCard title="NthomeAir" description="Elevate your travel experience." isComingSoon={true} />
        <ServiceCard
          title="NthomeFood"
          description="Delicious meals, delivered to your doorstep."
          isComingSoon={true}
        />
       
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 30,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    paddingHorizontal: 20,
    // marginTop: 20,
    marginBottom: 40,
    maxWidth: width - 10,
    lineHeight: 24,
  },
})

export default NthomeServicesScreen
