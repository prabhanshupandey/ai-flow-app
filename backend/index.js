const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  try {
const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openrouter/auto",   // 🔥 AUTO SELECT
    messages: [{ role: "user", content: prompt }],
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "AI Flow App"
    },
     timeout: 10000
  }
);

const reply = response.data.choices[0].message.content;
res.json({ reply });

  } catch (error) {
    console.log("ERROR 👉", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));