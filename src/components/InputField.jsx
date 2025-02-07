// src/components/InputField.jsx
import React from "react";
import "../styles/InputField.css";

const InputField = ({
  label,
  value,
  onChange,
  type = "number",
  placeholder,
}) => {
  return (
    <div className="input-field">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-element"
      />
    </div>
  );
};

export default InputField;
