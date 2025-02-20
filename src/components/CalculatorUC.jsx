import React, { useState } from "react";
import Button from "./Button";
import "../styles/CalculatorUC.css";

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

const CalculatorUC = ({ onBack }) => {
  const [av1Note1, setAv1Note1] = useState("");
  const [av1Note2, setAv1Note2] = useState("");
  const [av2Note1, setAv2Note1] = useState("");
  const [av2Note2, setAv2Note2] = useState("");
  const [av3Note1, setAv3Note1] = useState("");
  const [av3Note2, setAv3Note2] = useState("");
  const [finalResult, setFinalResult] = useState(null);

  const handleInputChange = (e, setNote) => {
    const newValue = clampValue(e.target.value);
    setNote(newValue);
  };

  const calculateUC = () => {
    const nAv1_1 = parseFloat(av1Note1);
    const nAv1_2 = parseFloat(av1Note2);
    const nAv2_1 = parseFloat(av2Note1);
    const nAv2_2 = parseFloat(av2Note2);
    const nAv3_1 = parseFloat(av3Note1);
    const nAv3_2 = parseFloat(av3Note2);

    if (
      !isNaN(nAv1_1) &&
      !isNaN(nAv1_2) &&
      !isNaN(nAv2_1) &&
      !isNaN(nAv2_2) &&
      !isNaN(nAv3_1) &&
      !isNaN(nAv3_2)
    ) {
      // 1) Calcula a média de cada AV (60/40)
      const av1 = nAv1_1 * 0.6 + nAv1_2 * 0.4;
      const av2 = nAv2_1 * 0.6 + nAv2_2 * 0.4;
      const av3 = nAv3_1 * 0.6 + nAv3_2 * 0.4;

      // 2) Aplica os pesos das AVs (0.3, 0.3, 0.4)
      const final = av1 * 0.4 + av2 * 0.3 + av3 * 0.3;

      setFinalResult(final);
    }
  };

  function getColorByFinal(valor) {
    if (valor < 6) return "red";
    if (valor >= 6 && valor < 7) return "yellow";
    if (valor >= 8 && valor < 9) return "blue";
    if (valor >= 9 && valor <= 10) return "green";
    // Se quiser tratar de outros intervalos, adicione mais condições ou ajuste as existentes
    return "neutral";
  }

  return (
    <div className="calculator-uc">
      <h2>Cálculo de UC's</h2>

      <div className="form-group">
        <div className="avGroup">
          <label>Nota da avaliação Escrita da AV1:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av1Note1}
            onChange={(e) => handleInputChange(e, setAv1Note1)}
          />

          <label>Nota da avaliação Formativa da AV1:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av1Note2}
            onChange={(e) => handleInputChange(e, setAv1Note2)}
          />
        </div>

        <div className="avGroup">
          <label>Nota da avaliação Escrita da AV2:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av2Note1}
            onChange={(e) => handleInputChange(e, setAv2Note1)}
          />

          <label>Nota da avaliação Formativa da AV2:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av2Note2}
            onChange={(e) => handleInputChange(e, setAv2Note2)}
          />
        </div>

        <div className="avGroup">
          <label>Nota da avaliação Escrita da AV3:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av3Note1}
            onChange={(e) => handleInputChange(e, setAv3Note1)}
          />

          <label>Nota da avaliação Formativa da da AV3:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={av3Note2}
            onChange={(e) => handleInputChange(e, setAv3Note2)}
          />
        </div>
      </div>

      <div className="button-group">
        <Button onClick={calculateUC}>Calcular UC</Button>
        <Button onClick={onBack}>Voltar</Button>
      </div>

      {finalResult !== null && (
        <div className="result animated-result">
          <h3>
            Resultado Final:{" "}
            <span
              className={`highlighted-result ${getColorByFinal(finalResult)}`}
            >
              {finalResult.toFixed(2)}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default CalculatorUC;
