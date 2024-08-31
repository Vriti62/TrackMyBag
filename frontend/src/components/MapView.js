import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import './MapView.css';

const socket = io.connect('http://localhost:3000');

const MapView = () => {
  const mapRef = useRef(null);
  const markers = useRef({});

  useEffect(() => {
    const map = L.map(mapRef.current).setView([0, 0], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap',
    }).addTo(map);

    socket.on('receive-location', (data) => {
      const { id, latitude, longitude } = data;

      if (markers.current[id]) {
        markers.current[id].setLatLng([latitude, longitude]);
      } else {
        markers.current[id] = L.marker([latitude, longitude]).addTo(map);
      }
    });

    socket.on('user-disconnected', (id) => {
      if (markers.current[id]) {
        map.removeLayer(markers.current[id]);
        delete markers.current[id];
      }
    });

    return () => {
      socket.off('receive-location');
      socket.off('user-disconnected');
    };
  }, []);

  return <div id="map" ref={mapRef} style={{ height: '80vh' }}></div>;
};

export default MapView;
