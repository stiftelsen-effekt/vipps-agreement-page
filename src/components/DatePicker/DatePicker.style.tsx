import styled from "styled-components";
import { orange10, orange20 } from "../../config/colors";

export const Wrapper = styled.div`
  margin-top: 5px;
	width: 100%;
`

export const Datebox = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 5px;
  font-family: 'Roboto',Arial,sans-serif;
  border: none;
  box-shadow: 0px 3px 6px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 0px 1.5px ${orange20};
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: ${orange10};
  }

  &:active {
    background-color: ${orange20} !important;
  }
`

export const DateText = styled.p`
  margin: 0;
  font-size: 14px;
  font-family: 'Roboto',Arial,sans-serif;
  padding-left: 3px;
  margin-bottom: 5px;
`