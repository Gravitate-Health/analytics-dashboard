const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// 🔹 API REST per ottenere gli eventi di Firebase Analytics
exports.getEvents = functions.https.onRequest(async (req, res) => {
  try {
    const eventsRef = db.collection("analytics_events"); // Cambia il nome della collezione se necessario
    const snapshot = await eventsRef.orderBy("timestamp", "desc").limit(100).get();

    let events = [];
    snapshot.forEach(doc => {
      events.push(doc.data());
    });

    return res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("❌ Errore nel recupero degli eventi:", error);
    return res.status(500).json({ success: false, message: "Errore nel server" });
  }
});
