// routes/trips.js
const express = require('express');
const app = express.Router();
const db = require('../config/config');
const firestoreDb = require('../config/FirebaseConfig').db;

// Endpoint to handle trip creation
app.post('/api/trips', (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming request body

    const {
        customerId, driverId, requestDate, currentDate, pickUpLocation, dropOffLocation, statuses,
        rating, feedback, duration_minutes, vehicle_type, distance_traveled, cancellation_reason,
        cancel_by, pickupTime, dropOffTime,pickUpCoordinates,dropOffCoordinates
    } = req.body;

    // Check for required fields
    if (!customerId || !driverId || !requestDate || !currentDate || !pickUpLocation || !dropOffLocation || !vehicle_type || !distance_traveled) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    // Prepare SQL query to insert trip data into MySQL
    const sql = `
        INSERT INTO trip (
            customerId, driverId, requestDate, currentDate, pickUpLocation, dropOffLocation, statuses,
            customer_rating, customer_feedback, duration_minutes, vehicle_type, distance_traveled, cancellation_reason,
            cancel_by, pickupTime, dropOffTime, pickUpCoordinates, dropOffCoordinates
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const pickUpCoordinatesJson = JSON.stringify(pickUpCoordinates); // Convert coordinates to JSON string
    const dropOffCoordinatesJson = JSON.stringify(dropOffCoordinates); // Convert coordinates to JSON string

    // Execute the SQL query to insert into MySQL
    db.query(sql, [
        customerId, driverId, requestDate, currentDate, pickUpLocation, dropOffLocation, statuses,
        rating, feedback, duration_minutes, vehicle_type, distance_traveled, cancellation_reason,
        cancel_by, pickupTime, dropOffTime, pickUpCoordinatesJson, dropOffCoordinatesJson
    ], async (err, result) => {
        if (err) {
            console.error("Error saving trip data:", err);
            return res.status(500).json({ error: "An error occurred while saving trip data" });
        }
        
        const tripId = result.insertId; // Get the inserted trip ID
        if (!tripId) {
            console.error("Trip ID not generated after insertion");
            return res.status(500).json({ error: "Failed to generate trip ID after insertion" });
        }

        // Insert trip data into Firestore for real-time tracking
        try {
            const tripRef = firestoreDb.collection('trips').doc(`${tripId}`);
            await tripRef.set({
                customerId,
                driverId,
                requestDate,
                currentDate,
                pickUpLocation,
                dropOffLocation,
                statuses,
                rating,
                feedback,
                duration_minutes,
                vehicle_type,
                distance_traveled,
                cancellation_reason,
                cancel_by,
                pickupTime,
                dropOffTime,
                pickUpCoordinates: pickUpCoordinatesJson,
                dropOffCoordinates: dropOffCoordinatesJson,
            });
            console.log("Trip data saved to Firestore.");

            // Respond with tripId in the response
            return res.status(200).json({ message: "Trip data saved successfully", tripId: tripId });
        } catch (firestoreError) {
            console.error("Error saving trip data to Firestore:", firestoreError);
            return res.status(500).json({ error: "Error saving trip data to Firestore" });
        }
    });
});


module.exports = app;
