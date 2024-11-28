// utils/calculateDistance.js

function calculateDistance(userLocation, luggageLocation) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = userLocation.latitude;
    const lon1 = userLocation.longitude;
    const lat2 = luggageLocation.latitude;
    const lon2 = luggageLocation.longitude;
  
    // Convert degrees to radians
    const lat1Rad = lat1 * (Math.PI / 180);
    const lon1Rad = lon1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    const lon2Rad = lon2 * (Math.PI / 180);
  
    // Differences in coordinates
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
  
    // Haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Distance in kilometers
    const distanceKm = R * c;
  
    // Convert to meters and return
    return distanceKm * 1000;
  }
  
  module.exports = calculateDistance;
  