// src/components/Button.jsx
import React from "react";
import "../styles/Button.css";

const Button = ({ onClick, children, type = "button" }) => {
  return (
    <button className="btn" type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
