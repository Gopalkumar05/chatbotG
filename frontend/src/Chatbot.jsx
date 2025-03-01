import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2, Send } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { id: Date.now(), sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:4000/chat", { message: input });
      setMessages([...newMessages, { id: Date.now(), sender: "bot", text: response.data.reply }]);
    } catch (error) {
      setMessages([...newMessages, { id: Date.now(), sender: "bot", text: "Error: Unable to fetch response" }]);
    }
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-purple-800 p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20"
      >
        <h2 className="text-3xl font-extrabold text-white mb-4 text-center">🤖 AI Chatbot</h2>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto border border-white/30 rounded-xl p-4 bg-white/20 backdrop-blur-lg space-y-4 shadow-inner">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`relative flex items-center group ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xs shadow-md transition-all duration-300 ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "bg-white/80 text-gray-900"
                }`}
              >
                {msg.text}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteMessage(msg.id)}
                className="absolute top-1/2 -translate-y-1/2 right-0 transform translate-x-7 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-5 h-5 text-gray-300 hover:text-red-400" />
              </button>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex mt-4 border border-white/30 rounded-lg overflow-hidden bg-white/20 backdrop-blur-lg">
          <input
            type="text"
            className="flex-grow p-3 bg-transparent text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 text-white px-5 hover:bg-blue-600 transition flex items-center"
            onClick={sendMessage}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
