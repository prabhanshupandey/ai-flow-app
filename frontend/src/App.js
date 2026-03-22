import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import React, { useState, useMemo, useCallback } from "react";

import InputNode from "./components/InputNode";
import OutputNode from "./components/OutputNode";

// ✅ OUTSIDE (STABLE)
const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // ✅ RUN FLOW
  const runFlow = useCallback(async () => {
    if (!prompt) return alert("Enter something!");

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const text = data.reply || "";

      let index = 0;

      const interval = setInterval(() => {
        setResponse((prev) => prev + text[index]);
        index++;

        if (index === text.length) {
          clearInterval(interval);
          setLoading(false);

          setHistory((prev) => [
            { prompt, response: text },
            ...prev,
          ]);
        }
      }, 15);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [prompt]);

  // ✅ ENTER KEY
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        runFlow();
      }
    },
    [runFlow]
  );

  // ✅ NODES (NO useEffect ❌)
  const nodes = useMemo(
    () => [
      {
        id: "1",
        type: "inputNode",
        position: { x: 300, y: 250 },
        data: { prompt, setPrompt, handleKeyDown },
      },
      {
        id: "2",
        type: "outputNode",
        position: { x: 700, y: 250 },
        data: { response, loading },
      },
    ],
    [prompt, response, loading, handleKeyDown]
  );

  // ✅ EDGES
  const edges = useMemo(
    () => [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
        style: { stroke: "#7c3aed", strokeWidth: 3 },
      },
    ],
    []
  );

  // ✅ SAVE
  const saveData = async () => {
    if (!prompt || !response) return alert("Run flow first!");

    await fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, response }),
    });

    alert("Saved ✅");
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#020617" }}>
      
      {/* SIDEBAR */}
      <div style={sidebarStyle}>
        <h2 style={{ color: "#fff" }}>⚡ AI Flow</h2>

        {history.length === 0 && <p style={{color:"#94a3b8"}}>No history</p>}

        <div style={{ marginTop: 20 }}>
          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => {
            
                setResponse(item.response);
              }}
              style={historyItem}
            >
              {item.prompt.slice(0, 28)}...
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <div style={navbarStyle}>
          <h2 style={{ color: "#fff" }}>🚀 AI Flow Builder</h2>

          <div>
            <button onClick={runFlow} style={runBtn}>
              {loading ? "⏳ Running..." : "Run"}
            </button>

            <button onClick={saveData} style={saveBtn}>
              Save
            </button>
          </div>
        </div>

        {/* FLOW */}
        <div style={{ flex: 1, overflow: "hidden" }}>
<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  fitView={false}
  panOnDrag={true}
  zoomOnScroll={true}
>
            <Background color="#0f172a" gap={18} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const sidebarStyle = {
  width: "260px",
  background: "linear-gradient(180deg,#020617,#0f172a)",
  padding: "20px",
  borderRight: "1px solid #1e293b",
};

const historyItem = {
  padding: "10px",
  margin: "8px 0",
  borderRadius: "10px",
  background: "#1e293b",
  color: "#cbd5f5",
  cursor: "pointer",
};

const navbarStyle = {
  padding: "15px 25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "rgba(15,23,42,0.8)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid #1e293b",
};

const runBtn = {
  background: "linear-gradient(45deg,#7c3aed,#6366f1)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  marginRight: "10px",
  cursor: "pointer",
};

const saveBtn = {
  background: "#22c55e",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

export default App;