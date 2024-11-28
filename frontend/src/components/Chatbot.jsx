import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionPrompt, setShowSuggestionPrompt] = useState(false);

  useEffect(() => {
    // Initial greeting when chatbot loads
    setChatHistory([
      { sender: "Bot", text: "Hi, I am your TrackMyBag Chatbot, Roboko. How can I help you?" }
    ]);
  }, []);

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;

    // Handle "hi" locally
    if (query.trim().toLowerCase() === "hi" || query.trim().toLowerCase() === "hello") {
      setChatHistory(prev => [
        ...prev,
        { sender: "User", text: query },
        { sender: "Bot", text: "Hello! How can I assist you today?" }
      ]);
      setQuery("");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", { query });
      const { reply, suggestions: newSuggestions } = response.data;

      setChatHistory(prev => [...prev, { sender: "User", text: query }, { sender: "Bot", text: reply }]);
      setSuggestions(newSuggestions || []);
      setShowSuggestionPrompt(newSuggestions.length > 0); // Show suggestion prompt if suggestions exist
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory(prev => [
        ...prev,
        { sender: "Bot", text: "Sorry, something went wrong. Please try again later." }
      ]);
    } finally {
      setQuery("");
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (id) => {
    const selectedSuggestion = suggestions.find(suggestion => suggestion.id === id);

    // Add the selected question to chat history
    setChatHistory(prev => [
      ...prev,
      { sender: "User", text: selectedSuggestion.question }
    ]);

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/chat", { selectedQuestionIndex: id });
      const { reply } = response.data;

      setChatHistory(prev => [
        ...prev,
        { sender: "Bot", text: reply }
      ]);
      setSuggestions([]); // Clear suggestions after a selection
      setShowSuggestionPrompt(false); // Hide suggestion prompt
    } catch (error) {
      console.error("Error fetching suggestion response:", error);
      setChatHistory(prev => [
        ...prev,
        { sender: "Bot", text: "Unable to fetch the answer. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.sender.toLowerCase()}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Loading...</div>}
      </div>

      <div className="suggestions-container">
        {showSuggestionPrompt && (
          <p className="suggestion-prompt">
            Please select a question from the following suggestions:
          </p>
        )}
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map(suggestion => (
              <button
                key={suggestion.id}
                className="suggestion-button"
                onClick={() => handleSuggestionClick(suggestion.id)}
              >
                {suggestion.question}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuerySubmit()}
        />
        <button onClick={handleQuerySubmit} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
