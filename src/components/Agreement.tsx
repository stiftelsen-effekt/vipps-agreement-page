import React, { useEffect, useState } from 'react';
import fetch from 'node-fetch';
import moment from 'moment'
import { SharesSelection } from './ShareSelection';
import styled from 'styled-components';
import formatCurrency from '../helpers/currency'
import { SharesDisplay } from './ShareDisplay/ShareDisplay';
import CurrencyInput from 'react-currency-input-field';
 

interface Agreement {
    amount: number;
    status: string;
    chargeDayOfMonth: string;
    KID: string;
    donorID: number;
}

interface Donor {
    full_name: string;
}

enum Inputs {
	SHARES,
	AMOUNT,
	NONE, 
    CANCEL,
    CANCELLED
  }

export function Agreement() {
    const [showInput, setShowInput] = useState<Inputs>(Inputs.NONE) // Rename to pages
    const [agreementAmount, setAgreementAmount] = useState<Number>(0)
    const [KID, setKID] = useState<string>("")
    const [distribution, setDistribution] = useState()
    const [donorID, setDonorID] = useState<number>()
    const [donorName, setDonorName] = useState<string>()
    const [nextChargeDate, setNextChargeDate] = useState<string>("")

    useEffect(() => {
        fetch('http://localhost:3000/vipps/agreement/agr_fKt6UEn')
            .then(res => res.json())
            .then((json: Agreement) => {
                console.log(json)
                setAgreementAmount(json.amount)
                setKID(json.KID)

                const today = new Date()
                const chargeDayOfMonth = json.chargeDayOfMonth

                // If the next charge date is the current month
                if (parseInt(chargeDayOfMonth) >= today.getDate()) {
                    setNextChargeDate(moment(today).format(chargeDayOfMonth + ".MM.YYYY"))
                }
                // If the next charge date is next month
                else if (parseInt(chargeDayOfMonth) < today.getDate()) {
                    const monthToday = today.getMonth()

                    // Month is zero indexed, hence the plus two
                    // If charge is due next month, handle December by setting January instead of adding 2 
                    const nextChargeMonth = monthToday === 11 ? "1" : monthToday + 2
                    setNextChargeDate(moment(today).format(`${json.chargeDayOfMonth}.${nextChargeMonth}.YYYY`))
                }

                // setDonorID(json.donorID)
                // setKID(json.KID)
            })
    }, [])

    /**
    useEffect(() => {
        const options = {
            headers: {'Authorization': AUTH_TOKEN}
        }

        if (KID && AUTH_TOKEN) {
            fetch(`http://localhost:3000/distributions/${KID}`, options)
                .then(res => res.json())
                .then((json) => {
                    console.log(json)
                    setDistribution(json)
                })
        }
        
        if (donorID) {
            fetch(`http://localhost:3000/donors/${donorID}`, options)
                .then(res => res.json())
                .then((json: Donor) => {
                    console.log(json)
                    setDonorName(json.full_name)
                })
        }
    }, [donorID, KID])
    */
    
    // TODO: Format amount
    return (
        <AgreementWrapper>
            <div>
                <Title>Din Vipps betalingsavtale</Title>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Sum per måned:</td>
                                <RightCell>{formatCurrency(agreementAmount.toString())} kr</RightCell>
                            </tr>
                            <tr>
                                <td>Neste trekkdato:</td>
                                <RightCell>{nextChargeDate}</RightCell>
                            </tr>
                            <tr>
                                <td>KID-nummer:</td>
                                <RightCell>{KID}</RightCell>
                            </tr>
                        </tbody>
                    </Table>
                    
                <ShareTitle>Din fordeling</ShareTitle>
                <SharesDisplay/>
            </div>
            {showInput === Inputs.NONE && 
                <ButtonWrapper>
                    <Button onClick={() => setShowInput(Inputs.AMOUNT)}>Endre sum</Button>
                    <Button onClick={() => setShowInput(Inputs.SHARES)}>Endre fordeling</Button>
                    <Button onClick={() => setShowInput(Inputs.CANCEL)}>Avslutt avtale</Button>
                </ButtonWrapper>
            }
            {showInput === Inputs.AMOUNT && 
                <SumInputWrapper>
                    <ShareTitle>Endrer sum</ShareTitle>
                    <StyledSumInput 
                        placeholder="Sum"
                        defaultValue={0}
                        decimalsLimit={2} 
                        onValueChange={(value, name) => console.log(value, name)}
                        groupSeparator="."
                        intlConfig={{locale: "nb-NO", currency: "NOK"}}
                    />
                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Lagre sum
                        </Button>
                    </ButtonWrapper>
                </SumInputWrapper>
            }
            {showInput === Inputs.SHARES &&
                <SharesWrapper>
                    <ShareTitle>Endrer fordeling</ShareTitle>
                    <SharesSelection />
                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Lagre fordeling
                        </Button>
                    </ButtonWrapper>
                </SharesWrapper>
            }
            {showInput === Inputs.CANCEL &&
                <CancelWrapper>
                    <ShareTitle>Avslutter avtale</ShareTitle>
                    <p>Er du sikker på at du vil avslutte avtalen?</p>
                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>Gå tilbake</Button>
                        <Button onClick={() => setShowInput(Inputs.CANCELLED)}>Avslutt avtale</Button>
                    </ButtonWrapper>
                </CancelWrapper>
            }
            {showInput === Inputs.CANCELLED &&
                <div>
                    <p>Avtalen din er nå avsluttet</p>
                </div>
            }
        </AgreementWrapper>
    );
}

const AgreementWrapper = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: center;

`

const ShareTitle = styled.h4`
    padding-bottom: 4px;
    border-bottom: 1px solid black;
    margin-bottom: 10px;
    width: 100%;
`

const Table = styled.table`
    width: 100%;
    margin-top: 10px;
`

const RightCell = styled.td`
    text-align: right;
`

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    @media only screen and (max-width: 500px) {
        flex-direction: column-reverse;
        align-items: center;
    }
`

const Button = styled.button`
    width: 140px;
    padding: 10px;
    font-size: 15px;

    @media only screen and (max-width: 500px) {
        margin-bottom: 30px;
    }
`

const StyledSumInput = styled(CurrencyInput)`
    font-size: 16px;
    padding: 5px;
    padding-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
    width: 400px;
`

const SumInputWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const CancelWrapper = styled.div`
    
`

const SharesWrapper = styled.div`
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h3`
    margin: 0;
`