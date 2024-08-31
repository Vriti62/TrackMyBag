// public/script.js

const socket = io();

// Initialize the map and set its view
const map = L.map('map').setView([0, 0], 16);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OpenStreetMap',
}).addTo(map);

// Ensure map container has dimensions
document.getElementById('map').style.height = '100vh';

const markers = {};

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('Sending location:', { latitude, longitude });
      socket.emit('send-location', { latitude, longitude });

      // Center the map on the user's location after getting the position
      map.setView([latitude, longitude], 16);
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error('Geolocation is not supported by this browser.');
}

// Handle receiving location data from the server
socket.on('receive-location', (data) => {
  console.log('Marker data:', data);

  const { id, latitude, longitude } = data;

  if (markers[id]) {
    // Update the marker's position
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker if it doesn't exist
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    console.log('Marker added for ID:', id);
  }
});

// Handle user disconnection
socket.on('user-disconnected', (id) => {
  console.log('User disconnected:', id);
  if (markers[id]) {
    // Remove the marker from the map
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
