import React from "react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import "../styles/Menu.css";

const Menu = () => {
  return (
    <nav className="main-menu">
      {/* Seção de redes sociais e telefone */}
      <div className="social-contacts">
        <a
          href="https://www.facebook.com/univsoficial"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FaFacebookF size="1.3em" color="#535353" />
        </a>

        <a
          href="https://www.instagram.com/univsoficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <IoLogoInstagram size="1.3em" color="#535353" />
        </a>

        <a
          href="https://www.youtube.com/c/TVUniVS"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <FaYoutube size="1.3em" color="#535353" />
        </a>

        {/* Divisor visual */}
        <span className="divider">|</span>

        <div className="phone-number">
          <a href="tel:8835619200">(88) 3561-9200</a>
        </div>
      </div>

      {/* Lista de links */}
      <ul className="menu-list">
        <li>
          <a
            href="https://portal.univs.edu.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portal Acadêmico
          </a>
        </li>
        <li>
          <a
            href="https://matriculas.univs.edu.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portal de Matrícula e Rematrícula
          </a>
        </li>
        <li>
          <a
            href="https://digital.unileao.edu.br/itvix_auth2/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ambiente Digital
          </a>
        </li>
        <li>
          <a
            href="https://univs.edu.br/nucleo-de-carreiras/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Carreira UniVS
          </a>
        </li>
        <li>
          <a
            href="https://dliportal.zbra.com.br/Login.aspx?key=tcc"
            target="_blank"
            rel="noopener noreferrer"
          >
            Biblioteca Virtual
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
