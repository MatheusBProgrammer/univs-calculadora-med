// src/components/Header.jsx
import React from "react";
import logo from "../assets/logo.png";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Calculadora de notas MedUnivs</h1>
    </header>
  );
};

export default Header;
