import React, { useState } from "react";
import Button from "./Button";
import "../styles/CalculatorUC.css";

// ----------------------------------------------------------------------------
// Função para validar e ajustar o valor digitado (0 a 10 ou vazio):
// ----------------------------------------------------------------------------
const validarValor = (valor) => {
  if (valor === "") return "";
  let valorNumerico = parseFloat(valor);
  if (isNaN(valorNumerico)) return "";
  if (valorNumerico < 0) valorNumerico = 0;
  if (valorNumerico > 10) valorNumerico = 10;
  return valorNumerico;
};

// ----------------------------------------------------------------------------
// Traduz as chaves internas ("av1Escrita" etc.) para rótulos mais amigáveis.
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Pesos dos tipos de avaliações (escrita/formativa) e pesos gerais de cada AV.
// ----------------------------------------------------------------------------
const PESOS_AV = {
  escrita: 0.6,
  formativa: 0.4,
};

const PESOS_GERAIS = {
  av1: 0.4,
  av2: 0.3,
  av3: 0.3,
};

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------------
const CalculatorUC = ({ onBack }) => {
  // Estados de cada campo de nota
  const [notaAv1Escrita, setNotaAv1Escrita] = useState("");
  const [notaAv1Formativa, setNotaAv1Formativa] = useState("");
  const [notaAv2Escrita, setNotaAv2Escrita] = useState("");
  const [notaAv2Formativa, setNotaAv2Formativa] = useState("");
  const [notaAv3Escrita, setNotaAv3Escrita] = useState("");
  const [notaAv3Formativa, setNotaAv3Formativa] = useState("");

  // Estado para armazenar o resultado final (após arredondamento)
  const [resultadoFinal, setResultadoFinal] = useState(null);

  // Mensagem exibida após cálculo ou simulação
  const [simulacaoMensagem, setSimulacaoMensagem] = useState("");

  // Armazena mensagem de erro, se houver
  const [error, setError] = useState(null);

  // ----------------------------------------------------------------------------
  // Função auxiliar para atualizar estado de cada campo (com validação).
  // ----------------------------------------------------------------------------
  const tratarMudancaInput = (e, setNota) => {
    const valor = validarValor(e.target.value);
    setNota(valor);
  };

  // ----------------------------------------------------------------------------
  // Cálculo de cada AV (ex.: AV1 = 0.6 * escrita + 0.4 * formativa).
  // Se algum campo não estiver definido (string vazia), converte para 0.
  // ----------------------------------------------------------------------------
  const calcularMediaAV = (escrita, formativa) => {
    return (
      (parseFloat(escrita) || 0) * PESOS_AV.escrita +
      (parseFloat(formativa) || 0) * PESOS_AV.formativa
    );
  };

  // ----------------------------------------------------------------------------
  // Somente retorna a média final SE todos os campos estiverem preenchidos.
  // Caso contrário, retorna null.
  // ----------------------------------------------------------------------------
  const obterMediaFinalSeCompleta = () => {
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

    // Calcula média de cada AV
    const mediaAv1 = calcularMediaAV(notaAv1Escrita, notaAv1Formativa);
    const mediaAv2 = calcularMediaAV(notaAv2Escrita, notaAv2Formativa);
    const mediaAv3 = calcularMediaAV(notaAv3Escrita, notaAv3Formativa);

    // Aplica pesos gerais
    return (
      mediaAv1 * PESOS_GERAIS.av1 +
      mediaAv2 * PESOS_GERAIS.av2 +
      mediaAv3 * PESOS_GERAIS.av3
    );
  };

  // ----------------------------------------------------------------------------
  // Arredondamento customizado: se parte decimal >= 0.95, sobe para o próximo inteiro.
  // Ex.: 6.95 => 7, 7.94 => 7.94, mas 7.95 => 8.
  // ----------------------------------------------------------------------------
  const aplicarArredondamento = (media) => {
    const parteDecimal = media - Math.floor(media);
    if (parteDecimal >= 0.95) {
      return Math.floor(media) + 1;
    }
    return media;
  };

  // ----------------------------------------------------------------------------
  // Retorna [parteFixa, coeficiente] para calcular "quanto preciso tirar"
  // em um CAMPO faltante para chegar à média 7.
  // ----------------------------------------------------------------------------
  const getEquacaoFaltanteCampo = (campoFaltante) => {
    // Converte cada campo para número ou 0 se estiver vazio
    const e1 = notaAv1Escrita === "" ? 0 : parseFloat(notaAv1Escrita);
    const f1 = notaAv1Formativa === "" ? 0 : parseFloat(notaAv1Formativa);
    const e2 = notaAv2Escrita === "" ? 0 : parseFloat(notaAv2Escrita);
    const f2 = notaAv2Formativa === "" ? 0 : parseFloat(notaAv2Formativa);
    const e3 = notaAv3Escrita === "" ? 0 : parseFloat(notaAv3Escrita);
    const f3 = notaAv3Formativa === "" ? 0 : parseFloat(notaAv3Formativa);

    // Zera a nota do campo faltante e calcula as 3 AVs
    const av1 =
      (campoFaltante === "av1Escrita" ? 0 : e1) * PESOS_AV.escrita +
      (campoFaltante === "av1Formativa" ? 0 : f1) * PESOS_AV.formativa;

    const av2 =
      (campoFaltante === "av2Escrita" ? 0 : e2) * PESOS_AV.escrita +
      (campoFaltante === "av2Formativa" ? 0 : f2) * PESOS_AV.formativa;

    const av3 =
      (campoFaltante === "av3Escrita" ? 0 : e3) * PESOS_AV.escrita +
      (campoFaltante === "av3Formativa" ? 0 : f3) * PESOS_AV.formativa;

    // Soma com os pesos gerais => parteFixa (tudo sem a nota faltante)
    let parteFixa =
      av1 * PESOS_GERAIS.av1 + av2 * PESOS_GERAIS.av2 + av3 * PESOS_GERAIS.av3;

    // Determina o coeficiente (quanto vale 1 ponto no campo faltante)
    let coeficiente = 0;
    switch (campoFaltante) {
      case "av1Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av1;
        break;
      case "av1Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av1;
        break;
      case "av2Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av2;
        break;
      case "av2Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av2;
        break;
      case "av3Escrita":
        coeficiente = PESOS_AV.escrita * PESOS_GERAIS.av3;
        break;
      case "av3Formativa":
        coeficiente = PESOS_AV.formativa * PESOS_GERAIS.av3;
        break;
      default:
        coeficiente = 0;
    }

    return [parteFixa, coeficiente];
  };

  // ----------------------------------------------------------------------------
  // Retorna [parteFixa, coeficiente] para calcular quanto falta em uma AV
  // COMPLETA (quando os dois campos estão vazios), para chegar à média 7.
  // Aqui, "avFaltante" vai ser "av1", "av2" ou "av3" — e o valor resultante
  // corresponderá ao valor de 0 a 10 daquela AV (já mesclando escrita e formativa).
  // ----------------------------------------------------------------------------
  const getEquacaoFaltanteAVCompleta = (avFaltante) => {
    // Calcula a média das AVs que NÃO estão faltando (soma parcial).
    // Av1, Av2, Av3 vão de 0 a 10 cada.
    // Precisamos descobrir a quanto a AV faltante deve chegar (0 a 10).
    //
    //  final = (av1*g1 + av2*g2 + av3*g3) >= 7
    //  se avFaltante = avX => avX*gX >= 7 - (somaDasOutrasAVs)
    //  avX >= (7 - somaDasOutrasAVs) / gX

    const e1 = notaAv1Escrita === "" ? 0 : parseFloat(notaAv1Escrita);
    const f1 = notaAv1Formativa === "" ? 0 : parseFloat(notaAv1Formativa);
    const e2 = notaAv2Escrita === "" ? 0 : parseFloat(notaAv2Escrita);
    const f2 = notaAv2Formativa === "" ? 0 : parseFloat(notaAv2Formativa);
    const e3 = notaAv3Escrita === "" ? 0 : parseFloat(notaAv3Escrita);
    const f3 = notaAv3Formativa === "" ? 0 : parseFloat(notaAv3Formativa);

    // AV1, AV2, AV3 reais (já calculadas) caso não estejam faltando por completo.
    const av1 = calcularMediaAV(e1, f1);
    const av2 = calcularMediaAV(e2, f2);
    const av3 = calcularMediaAV(e3, f3);

    // Soma parcial das AVs que NÃO são a faltante
    let somaParcial = 0;
    let pesoFaltante = 0; // peso geral da AV (g1, g2 ou g3)

    if (avFaltante === "av1") {
      somaParcial = av2 * PESOS_GERAIS.av2 + av3 * PESOS_GERAIS.av3;
      pesoFaltante = PESOS_GERAIS.av1;
    } else if (avFaltante === "av2") {
      somaParcial = av1 * PESOS_GERAIS.av1 + av3 * PESOS_GERAIS.av3;
      pesoFaltante = PESOS_GERAIS.av2;
    } else if (avFaltante === "av3") {
      somaParcial = av1 * PESOS_GERAIS.av1 + av2 * PESOS_GERAIS.av2;
      pesoFaltante = PESOS_GERAIS.av3;
    }

    // Precisamos de avFaltante >= X para atingir 7 no final
    // 7 <= somaParcial + avFaltante * pesoFaltante
    // avFaltante >= (7 - somaParcial) / pesoFaltante
    const parteFixa = somaParcial; // "já garantido" pelas outras AVs
    const coeficiente = pesoFaltante; // factor que multiplica a AV faltante

    return [parteFixa, coeficiente];
  };

  // ----------------------------------------------------------------------------
  // BOTÃO: CALCULAR
  // ----------------------------------------------------------------------------
  const calcularUC = () => {
    setSimulacaoMensagem("");
    setError(null);

    // 1) Calcula a média original (sem arredondar)
    const mediaOriginal = obterMediaFinalSeCompleta();
    if (mediaOriginal === null) {
      setResultadoFinal(null);
      setError(
        "Por favor, preencha todos os campos para calcular a média final."
      );
      return;
    }

    // 2) Aplica o arredondamento customizado
    const mediaArredondada = aplicarArredondamento(mediaOriginal);

    // 3) Salva a média final no estado
    setResultadoFinal(mediaArredondada);

    // 4) Define mensagem de status (Aprovado/Reprovado/AVF),
    //    e se houve arredondamento, exibe na mensagem
    const mensagem = getMensagemResultadoFinal(mediaOriginal, mediaArredondada);
    setSimulacaoMensagem(mensagem);
  };

  // ----------------------------------------------------------------------------
  // Retorna a mensagem de (Aprovado, Reprovado ou AVF), considerando a
  // média original e a média arredondada.
  // ----------------------------------------------------------------------------
  const getMensagemResultadoFinal = (mediaOriginal, mediaArredondada) => {
    // Verifica se houve diferença
    const houveArredondamento =
      Math.abs(mediaArredondada - mediaOriginal) > 0.000001;

    // Se >= 7 => Aprovado
    if (mediaArredondada >= 7) {
      if (houveArredondamento) {
        // Ex.: 6.95 => 7.00
        return (
          `Aprovado! Sua média era ${mediaOriginal.toFixed(2)}, ` +
          `mas foi arredondada para ${mediaArredondada.toFixed(2)}.`
        );
      } else {
        // Não houve arredondamento extra
        return `Aprovado! Sua média final é ${mediaArredondada.toFixed(2)}.`;
      }
    }

    // Se < 4 => Reprovado
    if (mediaArredondada < 4) {
      return `Reprovado! Sua média final é ${mediaArredondada.toFixed(2)}.`;
    }

    // Caso contrário => vai pra AVF
    const notaNecessaria = 12 - mediaArredondada;
    return (
      `Você irá para AVF! Sua média até agora é ${mediaArredondada.toFixed(
        2
      )}. ` +
      `Para ser aprovado, precisa tirar pelo menos ${notaNecessaria.toFixed(
        2
      )} na AVF.`
    );
  };

  // ----------------------------------------------------------------------------
  // BOTÃO: SIMULAR
  // ----------------------------------------------------------------------------
  const simularResultado = () => {
    setError(null);
    setResultadoFinal(null);

    // Se TODOS os campos estiverem preenchidos, é equivalente a "CALCULAR"
    const mediaOriginal = obterMediaFinalSeCompleta();
    if (mediaOriginal !== null) {
      // Já temos tudo preenchido
      const mediaArredondada = aplicarArredondamento(mediaOriginal);
      setResultadoFinal(mediaArredondada);
      setSimulacaoMensagem(
        getMensagemResultadoFinal(mediaOriginal, mediaArredondada)
      );
      return;
    }

    // Caso contrário, vamos verificar quais campos (ou AVs) estão em branco.
    const campos = {
      av1Escrita: notaAv1Escrita,
      av1Formativa: notaAv1Formativa,
      av2Escrita: notaAv2Escrita,
      av2Formativa: notaAv2Formativa,
      av3Escrita: notaAv3Escrita,
      av3Formativa: notaAv3Formativa,
    };

    // Precisamos agrupar por AV:
    // ex: se av1Escrita e av1Formativa AMBAS estiverem vazias, calculamos a AV1 inteira.
    // caso só 1 campo esteja vazio, calculamos por campo mesmo.
    const mensagens = [];

    // Função auxiliar pra checar se ambos os campos de uma AV estão vazios
    const ambosVazios = (nota1, nota2) => nota1 === "" && nota2 === "";

    // ---- AV1 ----
    if (ambosVazios(campos.av1Escrita, campos.av1Formativa)) {
      // Calcula quanto precisa para AV1 inteira
      const [parteFixa, coef] = getEquacaoFaltanteAVCompleta("av1");
      const xNeces = (7 - parteFixa) / coef;

      if (xNeces <= 0) {
        mensagens.push(
          `→ Para 'AV1', você já atingiu média ≥ 7 sem precisar de nota na AV1.`
        );
      } else if (xNeces > 10) {
        mensagens.push(
          `→ Para 'AV1', nem mesmo 10 seria suficiente para chegar a 7.`
        );
      } else {
        mensagens.push(
          `→ Para 'AV1', você precisa de pelo menos ${xNeces.toFixed(
            2
          )} (de 0 a 10) nesta avaliação.`
        );
      }
    } else {
      // Se somente um dos campos está vazio, calculamos campo a campo
      if (campos.av1Escrita === "" && campos.av1Formativa !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av1Escrita");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av1Escrita"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av1Escrita"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av1Escrita"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }

      if (campos.av1Formativa === "" && campos.av1Escrita !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av1Formativa");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av1Formativa"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av1Formativa"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av1Formativa"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }
    }

    // ---- AV2 ----
    if (ambosVazios(campos.av2Escrita, campos.av2Formativa)) {
      // Calcula quanto precisa para AV2 inteira
      const [parteFixa, coef] = getEquacaoFaltanteAVCompleta("av2");
      const xNeces = (7 - parteFixa) / coef;

      if (xNeces <= 0) {
        mensagens.push(
          `→ Para 'AV2', você já atingiu média ≥ 7 sem precisar de nota na AV2.`
        );
      } else if (xNeces > 10) {
        mensagens.push(
          `→ Para 'AV2', nem mesmo 10 seria suficiente para chegar a 7.`
        );
      } else {
        mensagens.push(
          `→ Para 'AV2', você precisa de pelo menos ${xNeces.toFixed(
            2
          )} (de 0 a 10).`
        );
      }
    } else {
      // Se somente um dos campos está vazio, calculamos campo a campo
      if (campos.av2Escrita === "" && campos.av2Formativa !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av2Escrita");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av2Escrita"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av2Escrita"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av2Escrita"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }

      if (campos.av2Formativa === "" && campos.av2Escrita !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av2Formativa");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av2Formativa"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av2Formativa"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av2Formativa"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }
    }

    // ---- AV3 ----
    if (ambosVazios(campos.av3Escrita, campos.av3Formativa)) {
      // Calcula quanto precisa para AV3 inteira
      const [parteFixa, coef] = getEquacaoFaltanteAVCompleta("av3");
      const xNeces = (7 - parteFixa) / coef;

      if (xNeces <= 0) {
        mensagens.push(
          `→ Para 'AV3', você já atingiu média ≥ 7 sem precisar de nota na AV3.`
        );
      } else if (xNeces > 10) {
        mensagens.push(
          `→ Para 'AV3', nem mesmo 10 seria suficiente para chegar a 7.`
        );
      } else {
        mensagens.push(
          `→ Para 'AV3', você precisa de pelo menos ${xNeces.toFixed(
            2
          )} (de 0 a 10).`
        );
      }
    } else {
      // Se somente um dos campos está vazio, calculamos campo a campo
      if (campos.av3Escrita === "" && campos.av3Formativa !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av3Escrita");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av3Escrita"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av3Escrita"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av3Escrita"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }

      if (campos.av3Formativa === "" && campos.av3Escrita !== "") {
        const [parteFixa, coef] = getEquacaoFaltanteCampo("av3Formativa");
        if (coef > 0) {
          const xNeces = (7 - parteFixa) / coef;
          if (xNeces <= 0) {
            mensagens.push(
              `→ Para '${handleCampo(
                "av3Formativa"
              )}', 0 já basta para chegar a 7.`
            );
          } else if (xNeces > 10) {
            mensagens.push(
              `→ Mesmo tirando 10 em '${handleCampo(
                "av3Formativa"
              )}', não chega a 7.`
            );
          } else {
            mensagens.push(
              `→ Para '${handleCampo(
                "av3Formativa"
              )}', precisa de ${xNeces.toFixed(2)}.`
            );
          }
        }
      }
    }

    // Exibe as mensagens resultantes
    if (mensagens.length === 0) {
      // Não foi possível simular nada de forma detalhada (caso bizarro).
      setSimulacaoMensagem("Nenhuma simulação disponível.");
    } else {
      setSimulacaoMensagem(mensagens.join("\n"));
    }
  };

  // ----------------------------------------------------------------------------
  // Define a cor visual da nota final
  // ----------------------------------------------------------------------------
  const obterCorPeloResultado = (valor) => {
    if (valor < 7) return "red";
    if (valor >= 7 && valor < 8) return "yellow";
    if (valor >= 8 && valor < 9) return "blue";
    if (valor >= 9 && valor <= 10) return "green";
    return "neutral";
  };

  // ----------------------------------------------------------------------------
  // RENDERIZAÇÃO
  // ----------------------------------------------------------------------------
  return (
    <div className="calculator-uc">
      <h2>Cálculo de UC's</h2>
      <div className="form-group">
        <div className="container-avGroup">
          <h3>Sala de aula invertida (AV1)</h3>
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
        </div>

        {/* AV2 */}
        <div className="container-avGroup">
          <h3>Laboratório Morfofuncional (AV2)</h3>
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
        </div>

        {/* AV3 */}
        <div className="container-avGroup">
          <h3>Laboratório de práticas funcionais (AV3)</h3>
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
      </div>

      {/* Botões */}
      <div className="button-group">
        <Button onClick={calcularUC}>Calcular UC</Button>
        <Button onClick={simularResultado}>Simular</Button>
        <Button onClick={onBack}>Voltar</Button>
      </div>

      {/* Erro (se algum) */}
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

      {/* Resultado Final (se calculado) */}
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

      {/* Mensagem de simulação ou status final */}
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
