import { Luggage, MapPin, Bell, Shield, ArrowRight, Plane, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import Chatbot from "./Chatbot"; // Import the Chatbot component
import "../styles/homepage.css";

const HomePage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  return (
    <div className="home-container">
      <header className="header-section">
        <a href="/" className="logo">
          <Luggage className="icon" />
          <span>TrackMyBag</span>
        </a>
        <nav className="nav">
          <Link to="/Support" className="nav-link">Need Help?</Link>
          <Link to="/login" className="nav-link">Admin?</Link>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <motion.div initial="initial" animate="animate" variants={stagger}>
              <motion.div variants={fadeIn} className="text-content">
                <h1>Never Lose Track of Your Luggage Again</h1>
                <p>
                  Real-time tracking for your luggage. Travel with peace of mind
                  knowing exactly where your belongings are at all times.
                </p>
              </motion.div>

              <motion.form variants={fadeIn} className="tracking-form">
                <Link to="/login">
                  <button type="button">Login to Track your Luggage</button>
                </Link>
              </motion.form>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Plane className="plane-icon" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="features-section">
          <h2>Our Features</h2>
          <motion.div initial="initial" whileInView="animate" variants={stagger}>
            <motion.div variants={fadeIn} className="feature">
              <MapPin className="feature-icon" />
              <h3>Real-Time Tracking</h3>
              <p>Know your luggage's location with our advanced GPS technology.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="feature">
              <Bell className="feature-icon" />
              <h3>Instant Notifications</h3>
              <p>Receive alerts about your luggage's status in real-time.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="feature">
              <Shield className="feature-icon" />
              <h3>Secure Technology</h3>
              <p>Your luggage and data are protected with our security measures.</p>
            </motion.div>
          </motion.div>
        </section>

        <section className="cta-section">
          <motion.div initial="initial" whileInView="animate">
            <h2>Start Tracking Your Luggage Today</h2>
            <Link to="/signup">
              <motion.button whileHover={{ scale: 1.05 }}>
                Get Started
                <ArrowRight className="arrow-icon" />
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Floating Chatbot Icon */}
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <MessageSquare size={32} />
      </div>

      {/* Chatbot Component */}
      {isChatbotVisible && <Chatbot />}
    </div>
  );
};

export default HomePage;
