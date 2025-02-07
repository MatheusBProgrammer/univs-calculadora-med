// src/components/CalculatorAverage.jsx
import React, { useState } from "react";
import Button from "./Button";
import "../styles/CalculatorAverage.css";

/**
 * Limita o valor entre 0 e 10.
 * - Se estiver vazio, retorna vazio (para permitir limpar o campo).
 * - Se não for número, retorna vazio.
 * - Caso contrário, retorna dentro do intervalo 0-10.
 */
const clampValue = (value) => {
  if (value === "") return "";
  let numericValue = parseFloat(value);
  if (isNaN(numericValue)) return "";
  if (numericValue < 0) numericValue = 0;
  if (numericValue > 10) numericValue = 10;
  return numericValue;
};

const CalculatorAverage = ({ onBack }) => {
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [nota3, setNota3] = useState("");
  const [media, setMedia] = useState(null);

  // Lida com mudanças no campo e "clampa" o valor entre 0 e 10
  const handleNotaChange = (e, setNota) => {
    const newValue = clampValue(e.target.value);
    setNota(newValue);
  };

  /* Logo acima (no mesmo arquivo) declare a função getColorByMedia: */
  function getColorByMedia(valor) {
    if (valor < 6) return "red";
    if (valor >= 6 && valor < 7) return "yellow";
    if (valor >= 8 && valor < 9) return "blue";
    if (valor >= 9 && valor <= 10) return "green";

    // Fallback (para valores entre 7 e 8, ou qualquer
    // outro valor que não se encaixe nas condições acima)
    return "neutral";
  }
  // Calcula a média
  const calculateAverage = () => {
    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    const n3 = parseFloat(nota3);

    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      setMedia((n1 + n2 + n3) / 3);
    }
  };

  return (
    <div className="calculator-average">
      <h2>Cálculo de Média</h2>

      <div className="form-group">
        <label>Nota da AV1:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={nota1}
          onChange={(e) => handleNotaChange(e, setNota1)}
        />

        <label>Nota da AV2:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={nota2}
          onChange={(e) => handleNotaChange(e, setNota2)}
        />

        <label>Nota da AV3:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={nota3}
          onChange={(e) => handleNotaChange(e, setNota3)}
        />
      </div>

      <div className="button-group">
        <Button onClick={calculateAverage}>Calcular Média</Button>
        <Button onClick={onBack}>Voltar</Button>
      </div>

      {media !== null && (
        <div className="result animated-result">
          <h3>
            A sua MÉDIA é de:{" "}
            <span className={`highlighted-average ${getColorByMedia(media)}`}>
              {media.toFixed(2)}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default CalculatorAverage;
