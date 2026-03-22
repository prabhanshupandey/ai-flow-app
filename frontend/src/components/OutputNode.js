import React from "react";
import { Handle, Position } from "reactflow";

function OutputNode({ data }) {
  return (
    <div style={boxStyle}>
      <h4 style={{ marginBottom: 8 }}>🤖 Output</h4>

      {data.loading ? (
        <p>⏳ Thinking...</p>
      ) : (
        <p style={textStyle}>
          {data.response || "Waiting..."}
        </p>
      )}

      {/* 🔥🔥 MOST IMPORTANT FIX */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#22c55e" }}
      />
    </div>
  );
}

/* 🔥 STYLES */

const boxStyle = {
  padding: 15,
  borderRadius: 14,
  background: "linear-gradient(135deg,#022c22,#064e3b)",
  color: "#a7f3d0",
  width: "100%",
  maxWidth: "420px",
  minHeight: "120px",
  maxHeight: "350px",
  overflowY: "auto",
  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  border: "1px solid #065f46",
};

const textStyle = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: "14px",
  lineHeight: "1.6",
};

export default OutputNode;