
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import React, { useState, useCallback, useEffect } from "react";
import Login from "./Login";

import InputNode from "./components/InputNode";
import OutputNode from "./components/OutputNode";

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const [nodes, setNodes] = useState([]);


  // ✅ resize detect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  window.dispatchEvent(new Event("resize"));
}, [isMobile]);

  // ✅ lock scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  // ✅ user load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);


  // ✅ LOAD HISTORY FROM DB (CORRECT PLACE)
useEffect(() => {
  if (user) {
    fetch(`http://ai-flow-app-nz0f.onrender.com/api/history/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
      })
      .catch((err) => console.log("History error", err));
  }
}, [user]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };


  useEffect(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);
}, [sidebarOpen]);

  // ✅ RUN FLOW
  const runFlow = useCallback(async () => {
    if (!prompt) return alert("Enter something!");
    if (!user) return alert("Login required");

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://ai-flow-app-nz0f.onrender.com/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
body: JSON.stringify({ prompt, user_id: user.id }),
      });

      const data = await res.json();
      const text = data.reply || "";

    setResponse(text);
setLoading(false);

setHistory((prev) => [
  {
    prompt,
    response: text,
    created_at: new Date().toISOString(),
  },
  ...prev,
]);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [prompt, user]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        runFlow();
      }
    },
    [runFlow]
  );

useEffect(() => {
  if (isMobile) {
    // 📱 Mobile → vertical (same as now)
    setNodes([
      {
        id: "1",
        type: "inputNode",
        position: { x: 20, y: 150 },
        data: { prompt, setPrompt, handleKeyDown },
      },
      {
        id: "2",
        type: "outputNode",
        position: { x: 20, y: 350 },
        data: { response, loading },
      },
    ]);
  } else {
    // 💻 Desktop → side by side 🔥
    const centerY = 250;

    setNodes([
      {
        id: "1",
        type: "inputNode",
        position: { x: 300, y: centerY },
        data: { prompt, setPrompt, handleKeyDown },
      },
      {
        id: "2",
        type: "outputNode",
        position: { x: 700, y: centerY },
        data: { response, loading },
      },
    ]);
  }
}, [isMobile, prompt, response, loading,handleKeyDown]);

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 3 },
    },
  ];

  const saveData = async () => {
    if (!prompt || !response) return alert("Run flow first!");

    await fetch("http://ai-flow-app-nz0f.onrender.com/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, response, user_id: user.id, name: user.name }),
    });

    alert("Saved ✅");
  };

  if (!user) return <Login setUser={setUser} />;

  return (
    <div style={{ display: isMobile ? "block" : "flex", height: "100vh",marginTop:'0.1%' }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          ...getSidebarStyle(isMobile),
          position: isMobile ? "fixed" : "relative",
          left: isMobile ? (sidebarOpen ? "0" : "-100%") : "0",
          top: 0,
          zIndex: 1000,
          transition: "left 0.3s ease",
        }}
      >
        <h2 style={{ color: "#fff" }}>⚡ AI Flow</h2>

        {history.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No history</p>
        )}

        <div style={{ marginTop: 20 }}>
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => setResponse(item.response)}
              style={historyItem}>
              {item.prompt.slice(0, 28)}...
                <br />
  <small>
    {item.created_at
      ? new Date(item.created_at).toLocaleString()
      : ""}
  </small>
            </div>
          ))}
        </div>

  <div style={{ marginTop: "auto", bottom: 0 }}>
          <button onClick={logout} style={logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* ✅ OVERLAY (correct place) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={overlayStyle}
        />
      )}

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <div style={navbarStyle}>
  
  {/* LEFT */}
  <div style={leftStyle}>
    {isMobile && (
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={menuBtn}>
        ☰
      </button>
    )}
    <h2 style={{ color: "#fff" }}>🚀 AI Flow</h2>
  </div>

  {/* RIGHT */}
  <div style={rightStyle}>
    <button onClick={runFlow} style={runBtn}>Run</button>
    <button onClick={saveData} style={saveBtn}>Save</button>

    {/* PROFILE */}
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setProfileOpen(!profileOpen)}
        style={profileBtn}
      >
        👤 {user.name}
      </div>

      {profileOpen && (
        <div style={dropdownStyle}>
          <div style={dropdownItem}>View Profile</div>
          <div style={dropdownItem} onClick={logout}>Logout</div>
        </div>
      )}
    </div>
  </div>
</div>
        {/* FLOW */}
   <div
  style={{
    width: "100%",
    height: "calc(100vh - 70px)", // 🔥 FIX
    background: "rgba(255,0,0,0.1)", // 👈 debug background
  }}
>
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
 
 minZoom={1}   // 🔥 ADD
  maxZoom={1}
  panOnDrag={false}

  zoomOnScroll={false}
  zoomOnPinch={false}
>
    <Background />
    <Controls />
  </ReactFlow>
</div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const getSidebarStyle = (isMobile) => ({
  width: isMobile ? "75%" : "260px",
  height: "95vh",
  background: "linear-gradient(180deg,#020617,#0f172a)",
  padding: "20px",
  borderRight: "1px solid #1e293b",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
});

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  zIndex: 999,
};

const navbarStyle = {
  padding: "12px 15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  background: "#0f172a",
};

const historyItem = {
  padding: "10px",
  margin: "8px 0",
  borderRadius: "10px",
  background: "#1e293b",
  color: "#cbd5f5",
  cursor: "pointer",
};

const runBtn = {
  background: "#6366f1",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
};

const saveBtn = {
  background: "#22c55e",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  padding: "8px 15px",
  borderRadius: "8px",
  border: "none",
};

const menuBtn = {
  fontSize: "20px",
  background: "transparent",
  border: "none",
  color: "#fff",
};

const leftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const rightStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const profileBtn = {
  background: "#1e293b",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const dropdownStyle = {
  position: "absolute",
  top: "45px",
  right: 0,
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: "10px",
  padding: "8px",
  width: "150px",
  zIndex: 1000,
};

const dropdownItem = {
  padding: "10px",
  cursor: "pointer",
  color: "#cbd5f5",
};

export default App;