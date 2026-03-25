import React, { useState } from "react";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  

const sendOTP = async () => {
  if (!name.trim() || !email.trim()) {
    alert("Please enter name and email ❌");
    return;
  }

  if (!email.includes("@")) {
    alert("Enter valid email ❌");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(`https://ai-flow-app-nz0f.onrender.com/api/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`Your OTP is: ${data.otp} 🔐`); // ✅ FIXED
      setStep(2); // ✅ IMPORTANT
    } else {
      alert("Failed to send OTP ❌");
    }

  } catch (err) {
    alert("Server error ❌");
  } finally {
    setLoading(false);
  }
};


  // ✅ VERIFY OTP
const verifyOTP = async () => {
  if (!otp.trim()) {
    alert("Enter OTP ❌");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("https://ai-flow-app-nz0f.onrender.com/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (data.success) {
      const user = data.user;

      // ✅ save user
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // 🔥 NEW: fetch history
    const historyRes = await fetch(
  `https://ai-flow-app-nz0f.onrender.com/api/history/${user.id}`
);
const historyData = await historyRes.json();

      // 👉 ye parent me bhejna hoga (important)
      if (window.setHistory) {
        window.setHistory(historyData);
      }

    } else {
      alert("Invalid OTP ❌");
    }
  } catch (err) {
    alert("Server error ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>🚀 AI Flow Login</h2>

        {step === 1 && (
          <>
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
            />

            <input
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />

            <button style={btn} onClick={sendOTP} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={input}
            />

            <button style={btn} onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            {/* 🔁 Back option */}
            <p style={backText} onClick={() => setStep(1)}>
              ← Change Email
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
};

const card = {
  width: "90%",
  maxWidth: "350px",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const title = {
  color: "#fff",
  textAlign: "center",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "#020617",
  color: "#fff",
  fontSize: "14px",
};

const btn = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(45deg,#7c3aed,#6366f1)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const backText = {
  color: "#94a3b8",
  fontSize: "13px",
  textAlign: "center",
  cursor: "pointer",
};