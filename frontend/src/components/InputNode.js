


import React, { useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

function InputNode({ data }) {
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ✅ AUTO RESIZE
  const handleChange = (e) => {
    data.setPrompt(e.target.value);

    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    requestAnimationFrame(() => {
      el.style.height = el.scrollHeight + "px";
    });
  };

  return (
    <div style={boxStyle}>
      
      {/* HEADER */}
      <div style={headerStyle}>
        <h4 style={{ margin: 0 }}>📝 Input</h4>

        <button
          onClick={() => data.setPrompt("")}
          style={clearBtn}
        >
          ✖
        </button>
      </div>

      {/* TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={data.prompt}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            data.handleKeyDown(e);

            // focus maintain
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 0);
          }
        }}
        placeholder="Type your prompt..."
        rows={1}
        style={inputStyle}
      />

      {/* CONNECTION HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </div>
  );
}

/* 🔥 STYLES */

// ✅ Responsive box
const boxStyle = {
  padding: "12px",
  borderRadius: "14px",
  background: "linear-gradient(135deg,#1e293b,#0f172a)",
  color: "#fff",

  width: "220px",   // ✅ FIXED WIDTH

  boxShadow: "0 0 20px rgba(0,0,0,0.6)",
  border: "1px solid #1e293b",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

// ✅ header (title + clear btn)
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

// ✅ textarea responsive
const inputStyle = {
  width: "100%",
  minHeight: "40px",
  maxHeight: "200px",
  overflowY: "auto",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  resize: "none",
  fontSize: "14px",
  lineHeight: "1.5",
  background: "#020617",
  color: "#fff",
};

// ✅ clear button
const clearBtn = {
  background: "transparent",
  border: "none",
  color: "#ef4444",
  fontSize: "14px",
  cursor: "pointer",
  padding: "4px 6px",
  borderRadius: "7px",
};

// ✅ handle style
const handleStyle = {
  background: "#6366f1",
  width: "10px",
  height: "10px",
};

export default InputNode;