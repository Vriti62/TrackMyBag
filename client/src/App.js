import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TrackLuggagePage from './pages/TrackLuggagePage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/track-luggage" component={TrackLuggagePage} />
          <Route path="/user-profile" component={UserProfilePage} />
          <Route path="/" exact component={TrackLuggagePage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
