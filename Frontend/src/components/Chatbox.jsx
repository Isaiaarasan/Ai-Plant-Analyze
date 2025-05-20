import React, { useState, useRef, useEffect } from 'react';
import './Chatbox.css';

function App() {
  const messageEnd = useRef(null);
  const [ans, setAns] = useState([]);
  const [addAsk, setAsk] = useState('');
  const [typing, setTyping] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');

  const messages = [
    "Ask me anything!",
    "What would you like to know about?",
    "I can help with a variety of topics - try asking about science, history, or literature.",
    "Do you need help with a specific problem or situation?",
    "Tell me about your day - I'm here to chat!",
    "I can also recommend books, movies, or TV shows - want a suggestion?",
    "Curious about a particular topic? Ask me and I'll do my best to answer!",
    "Need some advice or just want to vent? I'm here to listen.",
    "Let's have a conversation! What's on your mind?",
    "I can also tell jokes or fun facts - want to hear one?",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setRandomMessage(messages[randomIndex]);
  }, []);

  const handleAdd = async () => {
    if (!addAsk.trim()) return;

    // Add user message
    setTimeout(() => {
      setAns((prevAns) => [
        { responsed: addAsk, role: 'User' },
        ...prevAns,
      ]);
    }, 250);

    setAsk('');
    setTimeout(() => setTyping(true), 800);

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '1a9b0fb267msh6baa89733baea49p1b7dbfjsnab05e6fa9631',
        'X-RapidAPI-Host': 'chatgpt-api7.p.rapidapi.com',
      },
      body: JSON.stringify({ query: addAsk }),
    };

    try {
      const response = await fetch('https://chatgpt-api7.p.rapidapi.com/ask', options);
      const data = await response.json();

      setAns((prevAns) => [
        { responsed: data.response, role: 'Assistant' },
        ...prevAns,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  };

  const handleIntroDismiss = () => setShowIntro(false);

  const saveEnter = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <>
      <div className="apiApp">
        <div className="chat-container">
          <div className="chat-messages" ref={messageEnd}>
            {ans.map((message, index) => (
              <div key={index} className={`message ${message.role === 'User' ? 'user-message' : 'bot-message'}`}>
                {message.responsed}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={addAsk}
              placeholder="Type your message..."
              onChange={(e) => setAsk(e.target.value)}
              onKeyDown={saveEnter}
            />
            <button
              className="sendBtn"
              onClick={handleAdd}
              disabled={!addAsk}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
