import React from 'react';
import { AgreementPage } from './components/Agreement/AgreementPage';
import styled from 'styled-components';
import effekt_logo from './images/effekt_logo.png'


function App() {
  return (
    <AppContainer>
      <EffektLogo onClick={() => window.location.href = 'https://gieffektivt.no'} src={effekt_logo} alt="Gå til gieffektivt" />
      <AgreementPage />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
  -moz-appearance: textfield;
}
`

const EffektLogo = styled.img`
  width: 100px;
  height: auto;
  position: absolute;
  left: 0;

  @media only screen and (max-width: 900px) {
      position: relative;
      left: auto;
    }
`

export default App;
