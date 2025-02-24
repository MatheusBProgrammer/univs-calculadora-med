// src/App.jsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Menu from "./components/Menu"; // Novo Menu
import Header from "./components/Header";
import CalculatorMenu from "./components/CalculatorMenu";
import CalculatorAverage from "./components/CalculatorAverage";
import CalculatorUC from "./components/CalculatorUC";
import Footer from "./components/Footer"; // Novo Footer
import "./App.css"; // Importando os estilos do App.css

const App = () => {
  const [calcType, setCalcType] = useState("menu");

  const handleSelect = (type) => {
    setCalcType(type);
  };

  const handleBack = () => {
    setCalcType("menu");
  };

  // Variants para animar entrada e saída
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -100,
    },
  };

  return (
    <>
      <Menu />
      <div className="app-body">
        <Header />

        <AnimatePresence mode="wait">
          {calcType === "menu" && (
            <motion.div
              key="menu"
              className="app-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <CalculatorMenu onSelect={handleSelect} />
            </motion.div>
          )}

          {calcType === "average" && (
            <motion.div
              key="average"
              className="app-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <CalculatorAverage onBack={handleBack} />
            </motion.div>
          )}

          {calcType === "uc" && (
            <motion.div
              key="uc"
              className="app-container"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5 }}
            >
              <CalculatorUC onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer no final */}
      <Footer />
    </>
  );
};

export default App;
