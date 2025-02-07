// src/components/CalculatorMenu.jsx
import React from "react";
import Button from "./Button";
import "../styles/CalculatorMenu.css";

const CalculatorMenu = ({ onSelect }) => {
  return (
    <div className="calculator-menu">
      <h2>Selecione o tipo de cálculo:</h2>
      <div className="menu-buttons">
        <Button onClick={() => onSelect("average")}>Média de 3 notas</Button>
        <Button onClick={() => onSelect("uc")}>Cálculo de UC's</Button>
      </div>
    </div>
  );
};

export default CalculatorMenu;
