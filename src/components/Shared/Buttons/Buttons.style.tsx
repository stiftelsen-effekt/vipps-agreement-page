import styled from "styled-components";
import { orange15 } from "../../../config/colors";

export const BlackButton = styled.button`
  height: 45px;
  background: #000;
  color: white;
  font-weight: 600;
  font-size: 14px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 3px ${orange15};
  }
`

export const Button = styled.div`
  padding: 5px;
  height: 50px;
  min-width: 120px;
  font-weight: 600;
  font-size: 14px;
  box-sizing: border-box;
  box-shadow: 0px 3px 6px 0 rgba(0, 0, 0, 0.15);
  transition: all 90ms;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;

  &:hover {
    box-shadow: 0px 0px 0px 1.5px ${orange15}, 0px 3px 6px 0 rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1.5px ${orange15};
  }

  @media only screen and (max-width: 500px) {
      width: 90%;
    }
`;
