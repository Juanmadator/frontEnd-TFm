import React from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <Form.Select
      onChange={changeLanguage}
      value={i18n.language}
      aria-label="Language switcher"
      style={{
        marginLeft: "10px",
        backgroundColor: "#343a40",
        color: "#ffffff",
        borderColor: "#343a40",
        appearance: "none", // Oculta el estilo predeterminado del navegador
        WebkitAppearance: "none", // Compatibilidad con navegadores WebKit
        MozAppearance: "none", // Compatibilidad con Firefox
        paddingRight: "30px", // Espacio para la flecha personalizada
        backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNNC4yOTMgNi4yOTNsNC4yNzMgNC4yNzMgNC4yNzMtNC4yNzNhMSAxIDAgMCAxIDEuNDE0IDEuNDE0bC00Ljk3IDQuOTdhMSAxIDAgMCAxLTEuNDE0IDBsLTQuOTctNC45N2ExIDEgMCAwIDEgMS40MTQtMS40MTR6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')", // Flecha personalizada
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
      }}
    >
      <option value="es">Español</option>
      <option value="en">English</option>
     
    </Form.Select>
  );
};

export default LanguageSwitcher;
