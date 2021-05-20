import styled from "styled-components"
import CurrencyInput from 'react-currency-input-field'
import { gray18, orange15 } from "../../config/colors"

export const AgreementWrapper = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0px 3px 6px 0 rgba(0, 0, 0, 0.15);
    margin: 20px;

    @media only screen and (max-width: 650px) {
        width: 80%;
    }
`

export const NavigationWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

export const ShareTitle = styled.h4`
    padding-bottom: 4px;
    border-bottom: 1px solid black;
    margin-bottom: 10px;
    margin-top: 10px;
    width: 100%;
    font-family: 'Roboto',Arial,sans-serif;
`

export const Table = styled.table`
    width: 100%;
    margin-top: 10px;
`

export const LeftCell = styled.td`
    font-size: 14px;
    font-family: 'Roboto',Arial,sans-serif;
`

export const RightCell = styled.td`
    font-size: 14px;
    text-align: right;
    font-family: 'Roboto',Arial,sans-serif;
`

export const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    @media only screen and (max-width: 500px) {
        flex-direction: column-reverse;
        align-items: center;
    }
`

export const StyledSumInput = styled(CurrencyInput)`
    font-size: 16px;
    padding: 5px;
    padding-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    width: 100px;
    font-family: 'Roboto',Arial,sans-serif;
    border: 1px solid ${gray18};
    border-radius: 5px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        box-shadow: 0px 0px 0px 1.5px ${orange15};
    }
`

export const SumInputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto',Arial,sans-serif;
`

export const InfoText = styled.p`
    margin: 0;
    margin-top: 5px;
    text-align: left;
    font-size: 12px;
    width: 100%;
    font-family: 'Roboto',Arial,sans-serif;
`

export const ErrorText = styled.p`
    margin: 0;
    text-align: left;
    color: red;
    font-size: 12px;
    width: 100%;
    margin-top: 5px;
    font-family: 'Roboto',Arial,sans-serif;
`

export const ConfirmationText = styled.p`
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 16px;
    font-family: 'Roboto',Arial,sans-serif;
    width: 100%;
`

export const CancelWrapper = styled.div`
    
`

export const SharesWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const Title = styled.h3`
    margin: 0;
    margin-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid black;
    font-family: 'Roboto',Arial,sans-serif;
`

export const VippsLogo = styled.img`
  width: auto;
  height: 25px;
`