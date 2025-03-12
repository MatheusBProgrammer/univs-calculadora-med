import React, { useState } from "react";
import Button from "./Button";
import "../styles/CalculatorAverage.css";

const validarValor = (valor) => {
  if (valor === "") return "";
  let valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico)) return "";
  if (valorNumerico < 0) valorNumerico = 0;
  if (valorNumerico > 10) valorNumerico = 10;
  return valorNumerico;
};

const CalculatorAverage = ({ onBack }) => {
  const [notaAv1, setNotaAv1] = useState("");
  const [notaAv2, setNotaAv2] = useState("");
  const [notaAv3, setNotaAv3] = useState("");
  const [media, setMedia] = useState(null);

  const tratarMudancaNota = (e, setNota) => {
    const valor = validarValor(e.target.value);
    setNota(valor);
  };

  function obterCorPorMedia(valor) {
    if (valor < 6) return "red";
    if (valor >= 6 && valor < 7) return "yellow";
    if (valor >= 8 && valor < 9) return "blue";
    if (valor >= 9 && valor <= 10) return "green";
    return "neutral";
  }

  const calcularMedia = () => {
    const n1 = parseFloat(notaAv1);
    const n2 = parseFloat(notaAv2);
    const n3 = parseFloat(notaAv3);

    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      setMedia((n1 + n2 + n3) / 3);
    }
  };

  return (
    <div className="calculator-average">
      <h2>Cálculo de Média</h2>

      <div className="form-group">
        <div className="container-form">
        <label>Nota da AV1:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={notaAv1}
          onChange={(e) => tratarMudancaNota(e, setNotaAv1)}
        />
</div>
<div className="container-form">

        <label>Nota da AV2:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={notaAv2}
          onChange={(e) => tratarMudancaNota(e, setNotaAv2)}
        />
        </div>
        <div className="container-form">

        <label>Nota da AV3:</label>
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0 a 10"
          value={notaAv3}
          onChange={(e) => tratarMudancaNota(e, setNotaAv3)}
        />
        </div>
      </div>

      <div className="button-group">
        <Button onClick={calcularMedia}>Calcular Média</Button>
        <Button onClick={onBack}>Voltar</Button>
      </div>

      {media !== null && (
        <div className="result animated-result">
          <h3>
            A sua MÉDIA é de:{" "}
            <span className={`highlighted-average ${obterCorPorMedia(media)}`}>
              {media.toFixed(2)}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default CalculatorAverage;
