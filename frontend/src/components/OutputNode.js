
import React from "react";
import { Handle, Position } from "reactflow";

function OutputNode({ data }) {
  return (
    <div style={boxStyle}>

      {/* HEADER */}
      <div style={headerStyle}>
        <h4 style={{ margin: 0 }}>🤖 Output</h4>
      </div>

      {/* CONTENT */}
      <div style={contentStyle}>
       {data.loading ? (
  <p style={loadingStyle}>⚡ Generating response...</p>
) : (
  <p style={textStyle}>
    {data.response || "💬 Ask something..."}
  </p>
)}
      </div>

      {/* HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />
    </div>
  );
}

/* 🔥 STYLES */

// ✅ Responsive container
const boxStyle = {
  padding: "12px",
  borderRadius: "14px",
  background: "linear-gradient(135deg,#022c22,#064e3b)",
  color: "#a7f3d0",

  width: "240px",   // ✅ FIXED WIDTH (IMPORTANT)

  minHeight: "100px",
  maxHeight: "300px",
  overflow: "hidden",
  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  border: "1px solid #065f46",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

// ✅ header
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

// ✅ scrollable content
const contentStyle = {
  overflowY: "auto",
  flex: 1,
  paddingRight: "4px",
  transition: "all 0.2s ease",
};

// ✅ text
const textStyle = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: "14px",
  lineHeight: "1.6",
};

// ✅ loading style
const loadingStyle = {
  fontSize: "14px",
  opacity: 0.8,
};

// ✅ handle
const handleStyle = {
  background: "#22c55e",
  width: "10px",
  height: "10px",
};

export default OutputNode;