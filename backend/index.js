const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// 🔥 Supabase import
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Supabase connect (yaha apni keys daalo)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ AI API + SAVE TO DB
app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
      },
      {
      headers: {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "https://ai-flow-app-brown.vercel.app",
  "X-Title": "AI Flow App",
},
        timeout: 10000,
      }
    );

    const reply = response.data.choices[0].message.content;

    // 🔥 DB me save karo
    await supabase.from("flows").insert([
      { prompt: prompt, response: reply }
    ]);

    res.json({ reply });

  } catch (error) {
    console.log("ERROR 👉", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ GET ALL DATA
app.get("/flows", async (req, res) => {
  const { data, error } = await supabase
    .from("flows")
    .select("*");

  if (error) {
    console.log(error);
    return res.send("Error ❌");
  }

  res.json(data);
});

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// 🔥 PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));