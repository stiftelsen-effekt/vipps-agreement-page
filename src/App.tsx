import React from 'react';
import { Agreement } from './components/Agreement';
import styled from 'styled-components';

function App() {
  return (
    <AppContainer>
      <Agreement />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

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

export default App;
