import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Agreement } from './components/Agreement';

function App() {
  return (
    <div className="App">
      <p>Din Vipps månedlige betalingsavtale</p>
      <Agreement />
    </div>
  );
}

export default App;
