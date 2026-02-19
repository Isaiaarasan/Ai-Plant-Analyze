import React, { useState, useRef, useEffect } from 'react';

function Chatbox() {
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
    // Use a temporary variable to hold the message since addAsk will be cleared
    const currentMessage = addAsk;

    // Add user message immediately
    setAns((prevAns) => [
      { responsed: currentMessage, role: 'User' },
      ...prevAns,
    ]);

    setAsk('');
    setTyping(true);

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '1a9b0fb267msh6baa89733baea49p1b7dbfjsnab05e6fa9631',
        'X-RapidAPI-Host': 'chatgpt-api7.p.rapidapi.com',
      },
      body: JSON.stringify({ query: currentMessage }),
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
      setAns((prevAns) => [
        { responsed: "Sorry, I couldn't reach the server. Please try again.", role: 'Assistant' },
        ...prevAns,
      ]);
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
    <div className="flex justify-center items-center py-10 min-h-[calc(100vh-70px)] bg-gray-50">
      <div className="bg-white w-[400px] max-w-[95%] h-[600px] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-100">
        <div className="bg-primary p-4 text-white font-bold text-center border-b border-primary-dark/20">
          Plant AI Assistant
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse gap-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300" ref={messageEnd}>
          {typing && (
            <div className="self-start bg-white text-gray-500 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 text-sm shadow-sm animate-pulse">
              Typing...
            </div>
          )}

          {ans.map((message, index) => (
            <div
              key={index}
              className={`px-4 py-3 rounded-2xl max-w-[85%] break-words text-sm leading-relaxed shadow-sm ${message.role === 'User'
                  ? 'bg-primary text-white self-end rounded-br-none'
                  : 'bg-white text-gray-800 self-start rounded-bl-none border border-gray-200'
                }`}
            >
              {message.responsed}
            </div>
          ))}

          {ans.length === 0 && (
            <div className="text-center text-gray-400 my-auto p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-sm">{randomMessage}</p>
            </div>
          )}
        </div>

        <div className="flex p-4 border-t border-gray-100 bg-white">
          <input
            type="text"
            value={addAsk}
            placeholder="Type your message..."
            onChange={(e) => setAsk(e.target.value)}
            onKeyDown={saveEnter}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
          <button
            className="ml-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center disabled:hover:bg-primary"
            onClick={handleAdd}
            disabled={!addAsk.trim() || typing}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
