import React, { useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

function InputNode({ data }) {
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

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
      <h4 style={{ marginBottom: 8 }}>📝 Input</h4>

         <button
          onClick={() => data.setPrompt("")}
          style={clearBtn}
        >
          ✖
        </button>

      <textarea
        ref={textareaRef}
        value={data.prompt}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            data.handleKeyDown(e);

            // 🔥 focus maintain
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 0);
          }
        }}
        placeholder="Type your prompt..."
        rows={1}
        style={inputStyle}
      />

      {/* 🔥🔥 MOST IMPORTANT FIX */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#6366f1" }}
      />
    </div>
  );
}

/* 🔥 STYLES */

const boxStyle = {
  padding: 15,
  borderRadius: 14,
  background: "linear-gradient(135deg,#1e293b,#0f172a)",
  color: "#fff",
  width: 260,
  boxShadow: "0 0 20px rgba(0,0,0,0.6)",
  border: "1px solid #1e293b",
};

const inputStyle = {
  width: "100%",
  minHeight: "40px",
  maxHeight: "250px",
  overflowY: "auto",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  resize: "none",
  fontSize: "15px",
  lineHeight: "1.5",
  background: "#020617",
  color: "#fff",
};

const clearBtn = {
  background: "transparent",
  border: "none",
  color: "#ef4444",
  fontSize: "14px",
  cursor: "pointer",
  padding: "4px 6px",
  borderRadius: "7px",
};

export default InputNode;