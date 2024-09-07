const socket = io();

// Initialize the map and set its view
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

// Ensure map container has dimensions
document.getElementById("map").style.height = "100vh";

// Variables to store markers and manage order
let userMarker;
let luggageMarker;
let userId = null;
let luggageId = null;
let polyline;  // Variable to store the polyline

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Sending location:", { latitude, longitude });
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

// Handle receiving location data from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // Assign first connected client as the user, second as the luggage
  if (!userId) {
    userId = id;
    userMarker = L.marker([latitude, longitude], { icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })}).addTo(map).bindPopup("User Location");

  } else if (userId && !luggageId && id !== userId) {
    luggageId = id;
    luggageMarker = L.marker([latitude, longitude], { icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })}).addTo(map).bindPopup("Luggage Location");

    // Draw a line between the user and luggage
    const latlngs = [
      [userMarker.getLatLng().lat, userMarker.getLatLng().lng],
      [latitude, longitude]
    ];
    polyline = L.polyline(latlngs, { color: 'blue', weight: 4 }).addTo(map);

  } else {
    // Update marker position if it already exists
    if (id === userId) {
      userMarker.setLatLng([latitude, longitude]).update();
    } else if (id === luggageId) {
      luggageMarker.setLatLng([latitude, longitude]).update();

      // Update the line between the markers
      if (userMarker && luggageMarker) {
        const latlngs = [
          [userMarker.getLatLng().lat, userMarker.getLatLng().lng],
          [latitude, longitude]
        ];
        if (polyline) {
          polyline.setLatLngs(latlngs);
        }
      }
    }
  }

  // Center the map to show both markers
  if (userMarker && luggageMarker) {
    const bounds = L.latLngBounds(userMarker.getLatLng(), luggageMarker.getLatLng());
    map.fitBounds(bounds, { padding: [50, 50] });
  } else {
    map.setView([latitude, longitude], 16);
  }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
  console.log("User disconnected:", id);
  if (id === userId) {
    map.removeLayer(userMarker);
    userMarker = null;
    userId = null;
  } else if (id === luggageId) {
    map.removeLayer(luggageMarker);
    luggageMarker = null;
    luggageId = null;
    
    // Remove the polyline if the luggage marker is disconnected
    if (polyline) {
      map.removeLayer(polyline);
      polyline = null;
    }
  }
});
