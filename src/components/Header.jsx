import React from "react";
import logo from "../assets/logo.png";
import "../styles/Header.css";

// 1. Importe o motion do framer-motion
import { motion } from "framer-motion";

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      {/* 2. Use <motion.h1> ao invés de <h1> */}
      <motion.h1
        // estado inicial
        initial={{ opacity: 0, scale: 0.1 }}
        // estado final
        animate={{ opacity: 1, scale: 1 }}
        // configurações da animação
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        Calculadora de Notas MedUnivs
      </motion.h1>
    </header>
  );
};

export default Header;
