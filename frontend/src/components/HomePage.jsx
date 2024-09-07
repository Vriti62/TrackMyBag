import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css'; 

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="navbar-brand">
                    TrackMyBag
                </div>
                <div className="navbar-buttons">
                    <button onClick={() => window.location.href = '/login'}>Login</button>
                    <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
                </div>
            </nav>
            <div className="image-wrapper">
                <img 
                    src="/Luggage-tracker-OP1-1024x683.jpg" 
                    alt="Luggage Tracker" 
                    className="homepage-image" 
                />
            </div>
            <section className="home-features">
                <h2>Features</h2>
                <div className="features-container">
                    <div className="feature-card">
                        <h3>Real-time Tracking</h3>
                        <p>Track your luggage in real-time from anywhere in the world.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Notifications</h3>
                        <p>Receive notifications and alerts for your luggage status.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Seamless Integration</h3>
                        <p>Integrates smoothly with major airlines for effortless tracking.</p>
                    </div>
                </div>
            </section>
            <section className="home-call-to-action">
                <h2>Get Started</h2>
                <p>Sign up to start tracking your luggage today!</p>
                <button onClick={() => navigate('/signup')}>Sign Up</button>
      <br />
      <button onClick={() => navigate('/support')}>Support</button>
            </section>
        </div>
    );
};

export default Home;
