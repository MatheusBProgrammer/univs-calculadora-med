import React, { useState } from "react";
import Button from "./Button";
import "../styles/CalculatorUC.css";

const validarValor = (valor) => {
  if (valor === "") return "";
  let valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico)) return "";
  if (valorNumerico < 0) valorNumerico = 0;
  if (valorNumerico > 10) valorNumerico = 10;
  return valorNumerico;
};

const CalculatorUC = ({ onVoltar }) => {
  const [notaAv1Escrita, setNotaAv1Escrita] = useState("");
  const [notaAv1Formativa, setNotaAv1Formativa] = useState("");
  const [notaAv2Escrita, setNotaAv2Escrita] = useState("");
  const [notaAv2Formativa, setNotaAv2Formativa] = useState("");
  const [notaAv3Escrita, setNotaAv3Escrita] = useState("");
  const [notaAv3Formativa, setNotaAv3Formativa] = useState("");
  const [resultadoFinal, setResultadoFinal] = useState(null);

  // Pesos
  const PESOS_AV = {
    escrita: 0.6,
    formativa: 0.4,
  };

  const PESOS_GERAIS = {
    av1: 0.4,
    av2: 0.3,
    av3: 0.3,
  };

  const tratarMudancaInput = (e, setNota) => {
    const valor = validarValor(e.target.value);
    setNota(valor);
  };

  const calcularUC = () => {
    const nAv1Escrita = parseFloat(notaAv1Escrita);
    const nAv1Formativa = parseFloat(notaAv1Formativa);
    const nAv2Escrita = parseFloat(notaAv2Escrita);
    const nAv2Formativa = parseFloat(notaAv2Formativa);
    const nAv3Escrita = parseFloat(notaAv3Escrita);
    const nAv3Formativa = parseFloat(notaAv3Formativa);

    if (
      !isNaN(nAv1Escrita) &&
      !isNaN(nAv1Formativa) &&
      !isNaN(nAv2Escrita) &&
      !isNaN(nAv2Formativa) &&
      !isNaN(nAv3Escrita) &&
      !isNaN(nAv3Formativa)
    ) {
      // 1) Aplica os pesos das avaliações escritas e formativas e calcula a média de cada AV
      const mediaAv1 =
        nAv1Escrita * PESOS_AV.escrita + nAv1Formativa * PESOS_AV.formativa;

      const mediaAv2 =
        nAv2Escrita * PESOS_AV.escrita + nAv2Formativa * PESOS_AV.formativa;
      const mediaAv3 =
        nAv3Escrita * PESOS_AV.escrita + nAv3Formativa * PESOS_AV.formativa;

      // 2) Aplica os pesos gerais das AVs e calcula o resultado final
      const resultado =
        mediaAv1 * PESOS_GERAIS.av1 +
        mediaAv2 * PESOS_GERAIS.av2 +
        mediaAv3 * PESOS_GERAIS.av3;

      setResultadoFinal(resultado);
    }
  };

  const obterCorPeloResultado = (valor) => {
    if (valor < 7) return "red";
    if (valor >= 7 && valor < 8) return "yellow";
    if (valor >= 8 && valor < 9) return "blue";
    if (valor >= 9 && valor <= 10) return "green";
    return "neutral";
  };

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
            value={notaAv1Escrita}
            onChange={(e) => tratarMudancaInput(e, setNotaAv1Escrita)}
          />

          <label>Nota da avaliação Formativa da AV1:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={notaAv1Formativa}
            onChange={(e) => tratarMudancaInput(e, setNotaAv1Formativa)}
          />
        </div>

        <div className="avGroup">
          <label>Nota da avaliação Escrita da AV2:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={notaAv2Escrita}
            onChange={(e) => tratarMudancaInput(e, setNotaAv2Escrita)}
          />

          <label>Nota da avaliação Formativa da AV2:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={notaAv2Formativa}
            onChange={(e) => tratarMudancaInput(e, setNotaAv2Formativa)}
          />
        </div>

        <div className="avGroup">
          <label>Nota da avaliação Escrita da AV3:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={notaAv3Escrita}
            onChange={(e) => tratarMudancaInput(e, setNotaAv3Escrita)}
          />

          <label>Nota da avaliação Formativa da AV3:</label>
          <input
            type="number"
            min="0"
            max="10"
            placeholder="0 a 10"
            value={notaAv3Formativa}
            onChange={(e) => tratarMudancaInput(e, setNotaAv3Formativa)}
          />
        </div>
      </div>

      <div className="button-group">
        <Button onClick={calcularUC}>Calcular UC</Button>
        <Button onClick={onVoltar}>Voltar</Button>
      </div>

      {resultadoFinal !== null && (
        <div className="result animated-result">
          <h3>
            Resultado Final:{" "}
            <span
              className={`highlighted-result ${obterCorPeloResultado(
                resultadoFinal
              )}`}
            >
              {resultadoFinal.toFixed(2)}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default CalculatorUC;
