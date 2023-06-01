import React, { useState } from "react";
import "./App.css";

const fuzzyis = require("fuzzyis");

const { LinguisticVariable, Term, Rule, FIS } = fuzzyis;

const App = () => {
  const [password, setPassword] = useState("");
  const [securityResult, setSecurityResult] = useState("");
  const [securityStatus, setSecurityStatus] = useState("");

  const system = new FIS("Password security mether");

  const SECURITY = new LinguisticVariable("security", [0, 100]);
  system.addOutput(SECURITY);

  const LENGTH = new LinguisticVariable("length", [1, 500]);
  const COMPLEXITY = new LinguisticVariable("complexity", [0, 10]);

  system.addInput(COMPLEXITY);
  system.addInput(LENGTH);

  SECURITY.addTerm(new Term("insecure", "triangle", [0, 0, 40]));
  SECURITY.addTerm(new Term("average", "triangle", [35, 50, 70]));
  SECURITY.addTerm(new Term("secure", "triangle", [60, 100, 100]));

  COMPLEXITY.addTerm(new Term("simple", "triangle", [0, 0, 6]));
  COMPLEXITY.addTerm(new Term("normal", "triangle", [5, 7, 8]));
  COMPLEXITY.addTerm(new Term("complex", "triangle", [7, 10, 10]));

  LENGTH.addTerm(new Term("short", "triangle", [1, 1, 7]));
  LENGTH.addTerm(new Term("medium", "triangle", [6, 8, 12]));
  LENGTH.addTerm(new Term("long", "triangle", [11, 500, 500]));

  system.rules = [
    new Rule(["simple", "short"], ["insecure"], "and"),
    new Rule(["simple", "medium"], ["insecure"], "and"),
    new Rule(["simple", "long"], ["insecure"], "and"),
    new Rule(["normal", "short"], ["average"], "and"),
    new Rule(["normal", "medium"], ["average"], "and"),
    new Rule(["normal", "long"], ["secure"], "and"),
    new Rule(["complex", "short"], ["insecure"], "and"),
    new Rule(["complex", "medium"], ["secure"], "and"),
    new Rule(["complex", "long"], ["secure"], "and"),
  ];

  const handlePasswordChange = (event) => {
    
    const newPassword = event.target.value;
    

    
    if(newPassword.length < 500){
    setPassword(newPassword);

    const length = newPassword.length;
    const complexity = calculateComplexity(newPassword);

    const result = system.getPreciseOutput([complexity, length]);
    
    setSecurityResult(result);

    const status = getSecurityStatus(result);
    setSecurityStatus(status);
    }
    
  };

  const calculateComplexity = (password) => {
    let complexity = 0;
  
    const upperCasePattern = /[A-Z]/g;
    const lowerCasePattern = /[a-z]/g;
    const numberPattern = /[0-9]/g;
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
  
    if (password.match(upperCasePattern)) {
      complexity += 1;
    }
    if (password.match(lowerCasePattern)) {
      complexity += 1;
    }
    if (password.match(numberPattern)) {
      complexity += 1;
    }
    if (password.match(specialCharPattern)) {
      complexity += 1;
    }

      // Verificar intercalación de caracteres
      const hasInterleaving = (
        upperCasePattern.test(password) &&
        lowerCasePattern.test(password) &&
        numberPattern.test(password) &&
        specialCharPattern.test(password)
      );

      if (hasInterleaving) {
        complexity += 2;
      }

    
  if (password.length > 7 && (complexity > 2)) {
    complexity += 1;
  }

    if(password.length>16){
      complexity += 2;
    }
  
  
    return complexity;
  };
  

  const getSecurityStatus = (result) => {
    if (result >= 60) {
      return "Secure";
    } else if (result >= 30) {
      return "Average";
    } else {
      return "Insecure";
    }
  };

  const getPasswordResultColor = () => {
    if (securityStatus === "Secure") {
      return "green";
    } else if (securityStatus === "Average") {
      return "orange";
    } else {
      return "red";
    }
  };

  return (
    <div className="app">
      <h1>Password Checker 🔒</h1>
      <div className="password-container">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="password-input"
          placeholder="Introduzca la contraseña"
        />
      </div>
      {password && (
        <div
          className="result-container"
          style={{ backgroundColor: getPasswordResultColor() }}
        >
          <p className="password-length">
            Longitud de la contraseña: {password.length}
          </p>
          <p className="password-complexity">
            Complejidad de la contraseña: {calculateComplexity(password)}
          </p>
          <p className="password-result">
            Resultado de la seguridad de la contraseña: {securityResult}
          </p>
          <p className="password-status">Security Status: {securityStatus}</p>
        </div>
      )}
    </div>
  );
};

export default App;
