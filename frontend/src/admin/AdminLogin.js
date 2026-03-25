import React, { useState } from "react";

export default function AdminLogin({ setAdmin }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("https://ai-flow-app-nz0f.onrender.com/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("admin", "true");
      setAdmin(true);
    } else {
      alert("Invalid Admin ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">

      {/* 🔥 Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          👑 Admin Login
        </h2>

        {/* 🔐 Input */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Admin ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🚀 Button */}
        <button
          onClick={login}
          className="w-full mt-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-200"
        >
          Login
        </button>

        {/* ⚡ Footer */}
        <p className="text-center text-gray-300 text-sm mt-4">
          Secure Admin Access 🔐
        </p>
      </div>
    </div>
  );
}