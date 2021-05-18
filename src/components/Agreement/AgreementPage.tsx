import React, { useEffect, useState } from 'react'
import fetch from 'node-fetch'
import moment from 'moment'
import { SharesSelection } from '../ShareSelection'
import formatCurrency from '../../helpers/currency'
import { SharesDisplay } from '../ShareDisplay/ShareDisplay'
import useFetch from "react-fetch-hook"
import { AgreementWrapper, Title, Table, RightCell, ShareTitle, ButtonWrapper, SumInputWrapper, StyledSumInput, SharesWrapper, CancelWrapper, NavigationWrapper, VippsLogo, LeftCell } from './Agreement.style'
import { LoadingCircle } from '../Shared/LoadingCircle/LoadingCircle'
import { BlackButton, Button} from '../Shared/Buttons/Buttons.style'
import { TextInput } from '../TextInput/TextInput'
import { AgreementInfo } from './AgreementInfo'
import { API_URL } from '../../config/api'

enum Inputs {
	SHARES,
	AMOUNT,
	NONE, 
    CANCEL,
    CANCELLED,
    DATE
}

// Extract the agreement code from the url
const urlSplit = window.location.href.split("/")
const agreementId = urlSplit[urlSplit.length-1]

function updatePrice(price: string) {
    const body = { agreementId: agreementId, price: price};
    
    fetch(`${API_URL}/vipps/agreement/price`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function AgreementPage() {
    const [showInput, setShowInput] = useState<Inputs>(Inputs.NONE) // Rename to pages
    const [price, setPrice] = useState<string>("")
    
    return (
        <AgreementWrapper>
            <AgreementInfo />
            {showInput === Inputs.NONE && 
                <NavigationWrapper>
                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.AMOUNT)}>Endre sum</Button>
                        <Button onClick={() => setShowInput(Inputs.SHARES)}>Endre fordeling</Button>
                        <Button onClick={() => setShowInput(Inputs.DATE)}>Endre trekkdato</Button>
                    </ButtonWrapper>
                    <BlackButton onClick={() => setShowInput(Inputs.CANCEL)}>Avslutt avtale</BlackButton>
                </NavigationWrapper>
            }
            {showInput === Inputs.AMOUNT && 
                <SumInputWrapper>
                    <ShareTitle>Velg ny månedlig sum</ShareTitle>
                    <div style={{width: "100%", paddingTop: "10px", paddingBottom: "10px"}}> 
                        <TextInput
                            label="Sum"
                            denomination="kr"
                            name="sum"
                            type="tel"
                            placeholder="0"
                            defaultValue=""
                            onChange={(e) => {
                                const øre = (parseInt(e.currentTarget.value) * 100).toString()
                                setPrice(øre)
                                console.log(øre)
                            }}
                        />
                    </div>
                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => {
                            setShowInput(Inputs.NONE)
                            updatePrice(price)
                        }}>
                            Lagre sum
                        </Button>
                    </ButtonWrapper>
                </SumInputWrapper>
            }
            {showInput === Inputs.SHARES &&
                <SharesWrapper>
                    <ShareTitle>Velg ny fordeling</ShareTitle>
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
            {showInput === Inputs.DATE &&
                <SharesWrapper>
                    <ShareTitle>Velg ny trekkdato</ShareTitle>

                    <ButtonWrapper>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => setShowInput(Inputs.NONE)}>
                            Lagre trekkdato
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
                        <Button style={{backgroundColor: "black", color: "white"}} onClick={() => setShowInput(Inputs.CANCELLED)}>Avslutt avtale</Button>
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
