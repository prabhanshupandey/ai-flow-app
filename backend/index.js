

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
    family: 4
});
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 🔐 OTP GENERATE
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};



// =======================
// 🔥 AI API + SAVE HISTORY
// =======================
app.post("/api/ask-ai", async (req, res) => {
  const { prompt, user_id } = req.body;

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
          // "HTTP-Referer": "http://localhost:3000",
           "HTTP-Referer": "https://ai-flow-app-brown.vercel.app",
          "X-Title": "AI Flow App",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // ✅ SAVE TO DB (FIXED)
    const { error: dbError } = await supabase.from("flows").insert([
      {
        prompt,
        response: reply,
        user_id, // 🔥 only this needed
      },
    ]);

    if (dbError) {
      console.log("DB ERROR 👉", dbError);
    }

    res.json({ reply });
  } catch (error) {
    console.log("ERROR 👉", error.response?.data || error.message);
    res.status(500).json({ error: "AI failed" });
  }
});


app.post("/api/send-otp", async (req, res) => {
  const { name, email } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, message: "Name & Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("OTP 👉", otp);

  const { error } = await supabase
    .from("users")
    .upsert([{ name, email, otp }], { onConflict: "email" });

  if (error) {
    console.log("OTP ERROR:", error);
    return res.status(500).json({ success: false });
  }
  // 🔥 NON-BLOCKING EMAIL
try {
  await transporter.sendMail({
    from: `"AI Flow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2>`
  });

  console.log("Email sent ✅");
} catch (err) {
  console.log("EMAIL ERROR 👉", err);
  return res.status(500).json({ success: false, message: "Email failed" });
}

  // ✅ FAST RESPONSE
  res.json({ success: true, otp });
});

// =======================
// 🔐 VERIFY OTP (LOGIN)
// =======================
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("otp", otp)
    .single();

  if (error || !data) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  res.json({
    success: true,
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
    },
  });
});



// =======================
// ✅ TEST
// =======================
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


app.post("/api/admin/login", async (req, res) => {
  const { id, password } = req.body;

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", id)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
});



app.get("/api/admin/history", async (req, res) => {
  try {
    // 🔥 1. Get all users
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*");

    if (userError) throw userError;

    // 🔥 2. Get all flows
    const { data: flows, error: flowError } = await supabase
      .from("flows")
      .select("*")
      .order("created_at", { ascending: false });

    if (flowError) throw flowError;

    // 🔥 3. Map users with their history
    const result = users.map((user) => {
      const userFlows = flows.filter(
        (f) => f.user_id === user.id
      );

      return {
        user_id: user.id,
        name: user.name,
        email: user.email,
        total_prompts: userFlows.length,
        last_activity:
          userFlows.length > 0
            ? userFlows[0].created_at
            : null,
        history: userFlows, // full history
      };
    });

    res.json(result);
  } catch (err) {
    console.log("ADMIN ERROR 👉", err);
    res.status(500).json({ error: "Server Error" });
  }
});


app.get("/api/admin/user/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("flows")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Error fetching user history" });
  }

  res.json(data);
});


app.delete("/api/admin/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // 🔥 delete flows first
    await supabase.from("flows").delete().eq("user_id", id);

    // 🔥 delete user
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;

    console.log("Deleted user 👉", id);

    res.json({ success: true });
  } catch (err) {
    console.log("DELETE ERROR 👉", err);
    res.status(500).json({ success: false });
  }
});