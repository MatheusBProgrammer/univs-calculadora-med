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

// FUNÇÃO DE TRADUÇÃO PARA NOMES DE CAMPOS
const handleCampo = (campo) => {
  const traducoes = {
    av1Escrita: "AV1 Escrita",
    av1Formativa: "AV1 Formativa",
    av2Escrita: "AV2 Escrita",
    av2Formativa: "AV2 Formativa",
    av3Escrita: "AV3 Escrita",
    av3Formativa: "AV3 Formativa",
  };
  return traducoes[campo] || campo;
};

const CalculatorUC = ({ onBack }) => {
  // Estados de cada campo
  const [notaAv1Escrita, setNotaAv1Escrita] = useState("");
  const [notaAv1Formativa, setNotaAv1Formativa] = useState("");
  const [notaAv2Escrita, setNotaAv2Escrita] = useState("");
  const [notaAv2Formativa, setNotaAv2Formativa] = useState("");
  const [notaAv3Escrita, setNotaAv3Escrita] = useState("");
  const [notaAv3Formativa, setNotaAv3Formativa] = useState("");

  const [resultadoFinal, setResultadoFinal] = useState(null);

  const [simulacaoMensagem, setSimulacaoMensagem] = useState("");

  const [error, setError] = useState(null);

  const handlerOnVoltar = () => {
    onBack();
  };

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

  const calcularMediaAV = (escrita, formativa) => {
    return (
      (parseFloat(escrita) || 0) * PESOS_AV.escrita +
      (parseFloat(formativa) || 0) * PESOS_AV.formativa
    );
  };

  const obterMediaFinalSeCompleta = () => {
    // Se qualquer campo estiver vazio, retorna null
    const campos = [
      notaAv1Escrita,
      notaAv1Formativa,
      notaAv2Escrita,
      notaAv2Formativa,
      notaAv3Escrita,
      notaAv3Formativa,
    ];
    if (campos.some((v) => v === "")) {
      return null;
    }

    // Calcula cada média AV
    const mediaAv1 = calcularMediaAV(notaAv1Escrita, notaAv1Formativa);
    const mediaAv2 = calcularMediaAV(notaAv2Escrita, notaAv2Formativa);
    const mediaAv3 = calcularMediaAV(notaAv3Escrita, notaAv3Formativa);

    // Combina usando os pesos gerais
    return (
      mediaAv1 * PESOS_GERAIS.av1 +
      mediaAv2 * PESOS_GERAIS.av2 +
      mediaAv3 * PESOS_GERAIS.av3
    );
  };

  const aplicarArredondamento = (media) => {
    const parteDecimal = media - Math.floor(media);
    if (parteDecimal >= 0.95) {
      return Math.floor(media) + 1;
    }
    return media;
  };

  const getEquacaoFaltante = (campoFaltante) => {
    // Converte para numérico ou 0 (se em branco)
    const e1 = notaAv1Escrita === "" ? 0 : parseFloat(notaAv1Escrita);
    const f1 = notaAv1Formativa === "" ? 0 : parseFloat(notaAv1Formativa);
    const e2 = notaAv2Escrita === "" ? 0 : parseFloat(notaAv2Escrita);
    const f2 = notaAv2Formativa === "" ? 0 : parseFloat(notaAv2Formativa);
    const e3 = notaAv3Escrita === "" ? 0 : parseFloat(notaAv3Escrita);
    const f3 = notaAv3Formativa === "" ? 0 : parseFloat(notaAv3Formativa);

    // Primeiro, calculamos a parteFixa considerando que o campo faltante é zero naquele lugar
    const av1 =
      (campoFaltante === "av1Escrita" ? 0 : e1) * PESOS_AV.escrita +
      (campoFaltante === "av1Formativa" ? 0 : f1) * PESOS_AV.formativa;
    const av2 =
      (campoFaltante === "av2Escrita" ? 0 : e2) * PESOS_AV.escrita +
      (campoFaltante === "av2Formativa" ? 0 : f2) * PESOS_AV.formativa;
    const av3 =
      (campoFaltante === "av3Escrita" ? 0 : e3) * PESOS_AV.escrita +
      (campoFaltante === "av3Formativa" ? 0 : f3) * PESOS_AV.formativa;

    let parteFixa =
      av1 * PESOS_GERAIS.av1 + av2 * PESOS_GERAIS.av2 + av3 * PESOS_GERAIS.av3;

    // Agora descobrimos qual o coeficiente (quanto "pesa" 1 ponto na avaliação faltante)
    let coeficiente = 0;
    switch (campoFaltante) {
      // av1
      case "av1Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av1; // 0.6 * 0.4 = 0.24
        break;
      case "av1Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av1; // 0.4 * 0.4 = 0.16
        break;
      // av2
      case "av2Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av2; // 0.6 * 0.3 = 0.18
        break;
      case "av2Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av2; // 0.4 * 0.3 = 0.12
        break;
      // av3
      case "av3Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av3; // 0.6 * 0.3 = 0.18
        break;
      case "av3Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av3; // 0.4 * 0.3 = 0.12
        break;
      default:
        coeficiente = 0;
    }

    return [parteFixa, coeficiente];
  };

  // --- BOTÃO CALCULAR ---
  const calcularUC = () => {
    setSimulacaoMensagem("");
    setError(null);

    const media = obterMediaFinalSeCompleta();

    if (media === null) {
      setResultadoFinal(null);
      setError(
        "Por favor, preencha todos os campos para calcular a média final."
      );
      return;
    }

    // Aplica arredondamento
    const mediaArredondada = aplicarArredondamento(media);
    setResultadoFinal(mediaArredondada);

    // Define mensagem de status
    const mensagem = getMensagemResultadoFinal(mediaArredondada);
    setSimulacaoMensagem(mensagem);
  };

  // Retorna a mensagem de (Aprovado, Reprovado ou AVF) dada a média final
  const getMensagemResultadoFinal = (mediaArredondada) => {
    if (mediaArredondada >= 7) {
      return `Aprovado! Sua média final é ${mediaArredondada.toFixed(2)}.`;
    } else if (mediaArredondada < 4) {
      return `Reprovado! Sua média final é ${mediaArredondada.toFixed(2)}.`;
    } else {
      const notaNecessaria = 12 - mediaArredondada;
      return (
        `Você irá para AVF! Sua média até agora é ${mediaArredondada.toFixed(
          2
        )}. ` +
        `Para ser aprovado, precisa tirar pelo menos ${notaNecessaria.toFixed(
          2
        )} na AVF.`
      );
    }
  };

  // --- BOTÃO SIMULAR ---
  const simularResultado = () => {
    setError(null);
    setResultadoFinal(null);

    // Checa campos vazios
    const campos = {
      av1Escrita: notaAv1Escrita,
      av1Formativa: notaAv1Formativa,
      av2Escrita: notaAv2Escrita,
      av2Formativa: notaAv2Formativa,
      av3Escrita: notaAv3Escrita,
      av3Formativa: notaAv3Formativa,
    };

    const camposVazios = Object.keys(campos).filter(
      (key) => campos[key] === ""
    );

    // Se não houver campos vazios, funciona como um "espelho" do Calcular
    if (camposVazios.length === 0) {
      const media = obterMediaFinalSeCompleta();
      if (media !== null) {
        const mediaArredondada = aplicarArredondamento(media);
        setResultadoFinal(mediaArredondada);
        setSimulacaoMensagem(getMensagemResultadoFinal(mediaArredondada));
      }
      return;
    }

    // Se houver campos vazios, calcula quanto é preciso em cada um para chegar a média 7
    const mensagens = [];

    camposVazios.forEach((campo) => {
      const [parteFixa, coef] = getEquacaoFaltante(campo);

      if (coef === 0) {
        mensagens.push(
          `Não foi possível simular para o campo ${handleCampo(campo)}.`
        );
        return;
      }

      const xNeces = (7 - parteFixa) / coef;

      if (xNeces <= 0) {
        mensagens.push(
          `Para '${handleCampo(
            campo
          )}', 0 já é suficiente (você já atingiu ou ultrapassa a média 7).`
        );
      } else if (xNeces > 10) {
        mensagens.push(
          `Para '${handleCampo(
            campo
          )}', mesmo tirando 10 não atinge média 7 (impossível).`
        );
      } else {
        mensagens.push(
          `Para '${handleCampo(
            campo
          )}', você precisa tirar ao menos ${xNeces.toFixed(
            2
          )} para chegar em 7.`
        );
      }
    });

    setSimulacaoMensagem(mensagens.join("\n"));
  };

  // Define a cor conforme a média final
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
        <Button onClick={simularResultado}>Simular</Button>
        <Button onClick={handlerOnVoltar}>Voltar</Button>
      </div>

      {error && (
        <p
          className="error"
          style={{
            color: "red",
            fontSize: "1.5em",
            textAlign: "center",
            paddingTop: "1em",
          }}
        >
          {error}
        </p>
      )}

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

      {simulacaoMensagem && (
        <div
          className="simulation-result"
          style={{
            whiteSpace: "pre-line",
            textAlign: "center",
            paddingTop: "0.8em",
            color: "gray",
          }}
        >
          <h3>{simulacaoMensagem}</h3>
        </div>
      )}
    </div>
  );
};

export default CalculatorUC;
