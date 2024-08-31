import React from 'react';
import './styles/App.css';
import MapView from './components/MapView';
import LuggageList from './components/LuggageList';
import LuggageForm from './components/LuggageForm';
import { LuggageProvider } from './contexts/LuggageContext';

function App() {
  return (
    <LuggageProvider>
      <div className="App">
        <h1>Luggage Tracking System</h1>
        <LuggageForm />
        <LuggageList />
        <MapView />
      </div>
    </LuggageProvider>
  );
}

export default App;
