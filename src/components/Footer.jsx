import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <span className="copyright">
          Portal UniVS 1.0 - Copyright © Todossss os direitos reservados
        </span>

        <span className="institution">
          Centro Universitário Vale do Salgado
        </span>

        <span className="contact">
          (88) 3561.9200 | faleconosco@univs.edu.br
        </span>
      </div>
    </footer>
  );
};

export default Footer;
