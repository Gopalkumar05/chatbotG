const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
     origin: 'https://chatbotg-1.onrender.com',
}));
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: message }] }]
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ reply });
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
