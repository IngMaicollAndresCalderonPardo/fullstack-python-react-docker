import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 20,
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // evitar cerrar al click dentro
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            fontSize: 24,
            fontWeight: "bold",
            cursor: "pointer",
            color: "#555",
          }}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        {title && <h3 style={{ marginBottom: 10, fontWeight: "bold" }}>{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
}
