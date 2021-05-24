import React, { useEffect, useState } from 'react'
import formatCurrency from '../../helpers/currency'
import { AgreementWrapper, Title, ShareTitle, ButtonWrapper, SumInputWrapper, SharesWrapper, CancelWrapper, NavigationWrapper, InfoText, ErrorText, ConfirmationText, VippsLogo } from './Agreement.style'
import { LoadingCircle } from '../Shared/LoadingCircle/LoadingCircle'
import { BlackButton, Button} from '../Shared/Buttons/Buttons.style'
import { TextInput } from '../TextInput/TextInput'
import { AgreementInfo } from './AgreementInfo'
import { cancelAgreement, updatePrice } from '../../helpers/requests'
import { SharesDisplay } from '../ShareDisplay/ShareDisplay'
import { DatePicker } from '../DatePicker/DatePicker'
import { API_URL } from '../../config/api'
import useFetch from "react-fetch-hook"
import { getNextChargeDate } from '../../helpers/dates'
import { SharesSelection } from '../ShareSelection/ShareSelection'
import vipps_logo from '../../images/vipps_logo.svg'
export enum Pages {
	SHARES,
	AMOUNT,
	NONE, // Replace
    CANCEL,
    CANCELLED,
    DATE,
    CONFIRMATION,
    PAUSE // Divide confirmation into CONFIRMSUM, etc.
}

export enum Changes {
    NONE,
	SUM,
    SHARES,
    DATE,
    CANCELLED
}

export interface Agreement {
    amount: number;
    status: string;
    chargeDayOfMonth: string;
    KID: string;
    donorID: number;
}

// Extract the agreement code from the url
const urlSplit = window.location.href.split("/")
const agreementCode = urlSplit[urlSplit.length-1]

export function AgreementPage() {
    const agreementRequest = useFetch<Agreement>(`${API_URL}/vipps/agreement/urlcode/${agreementCode || "empty"}`);
    const [agreement, setAgreement] = useState<Agreement>()
    const [nextChargeDate, setNextChargeDate] = useState<string>("")
    const [newChargeDay, setNewChargeDay] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.NONE)
    const [inputPrice, setInputPrice] = useState<string>("")
    const [invalidPrice, setInvalidPrice] = useState<boolean>(false)
    const [pauseDate, setPauseDate] = useState<Date>(new Date())
    const [confirmChange, setConfirmChange] = useState<Changes>(Changes.NONE)
    const [showLoading, setShowLoading] = useState<boolean>(false)
    const [KID, setKID] = useState<string>("")
    
    useEffect(() => {
        if (agreementRequest.data) {
            setAgreement(agreementRequest.data)
            setKID(agreementRequest.data.KID)
            setNextChargeDate(getNextChargeDate(agreementRequest.data.chargeDayOfMonth) || "")
        }
    }, [agreementRequest.data])


    if (agreementRequest.isLoading || showLoading) return <AgreementWrapper><LoadingCircle/></AgreementWrapper>
    if (agreementRequest.data?.status === "STOPPED" || !agreementRequest.data) return (
        <AgreementWrapper>
            <div>
                <VippsLogo src={vipps_logo}/>
                <ShareTitle>Denne avtalen er avsluttet eller finnes ikke</ShareTitle>
                <p>Du kan starte en ny avtale på gieffektivt.no</p>
                <BlackButton onClick={() => window.location.replace("https://gieffektivt.no")}>Gå til gieffektivt.no</BlackButton>
            </div>
        </AgreementWrapper>
    )
       
    return (
        <AgreementWrapper>
            {currentPage !== Pages.CONFIRMATION && 
                <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
            }
            {currentPage === Pages.NONE && 
                <NavigationWrapper>
                    <ButtonWrapper>
                        <Button onClick={() => setCurrentPage(Pages.AMOUNT)}>Endre sum</Button>
                        <Button onClick={() => setCurrentPage(Pages.SHARES)}>Endre fordeling</Button>
                        <Button onClick={() => setCurrentPage(Pages.DATE)}>Endre trekkdag</Button>
                    </ButtonWrapper>
                    <BlackButton onClick={() => setCurrentPage(Pages.PAUSE)}>Sett på pause</BlackButton>
                    <BlackButton onClick={() => setCurrentPage(Pages.CANCEL)}>Avslutt avtale</BlackButton>
                </NavigationWrapper>
            }
            {currentPage === Pages.AMOUNT && 
                <SumInputWrapper>
                    <ShareTitle>Velg ny månedlig sum</ShareTitle>
                    <InfoText>Endring av sum må gjøres minst tre dager i forveien av neste trekkdato</InfoText>
                    {invalidPrice && <ErrorText>Ugyldig sum</ErrorText>}
                    <div style={{width: "100%", paddingTop: "10px", paddingBottom: "10px"}}> 
                        <TextInput
                            label="Sum"
                            denomination="kr"
                            inputMode="numeric"
                            name="sum"
                            type="number"
                            placeholder="0"
                            defaultValue={inputPrice}
                            selectOnClick
                            onChange={(e) => {
                                const øre = (parseInt(e.currentTarget.value) * 100).toString()
                                setInputPrice(øre)
                                setInvalidPrice(false)
                            }}
                        />
                    </div>
                    <ButtonWrapper>
                        <Button onClick={() => setCurrentPage(Pages.NONE)}>
                            Avbryt
                        </Button>
                        <Button onClick={() => {
                            if (parseInt(inputPrice) > 0) {
                                updatePrice(agreementCode, inputPrice)
                                setCurrentPage(Pages.CONFIRMATION)
                                setConfirmChange(Changes.SUM)
                            } 
                            else setInvalidPrice(true)
                        }}>
                            Lagre sum
                        </Button>
                    </ButtonWrapper>
                </SumInputWrapper>
            }
            {currentPage === Pages.SHARES &&
                <SharesWrapper>
                    <ShareTitle>Velg ny fordeling</ShareTitle>
                    <SharesSelection
                        agreementCode={agreementCode}
                        setKID={(newKID: string) => setKID(newKID)}
                        setCurrentPage={(newPage: Pages) => setCurrentPage(newPage)}
                        setConfirmChange={(change: Changes) => setConfirmChange(change)} 
                    />
                </SharesWrapper>
            }
            {currentPage === Pages.DATE &&
                <SharesWrapper>
                    <ShareTitle>Velg ny trekkdag</ShareTitle>
                    <DatePicker
                        agreement={agreement}
                        agreementCode={agreementCode}
                        setNewChargeDay={(day: string) => setNewChargeDay(day)}
                        setCurrentPage={(page: Pages) => setCurrentPage(page)} 
                        setConfirmChange={(change: Changes) => setConfirmChange(change)}
                    />
                </SharesWrapper>
            }
            {currentPage === Pages.CANCEL &&
                <CancelWrapper>
                    <ShareTitle>Avslutter avtale</ShareTitle>
                    <p>Er du sikker på at du vil avslutte avtalen?</p>
                    <ButtonWrapper>
                        <Button onClick={() =>  setCurrentPage(Pages.NONE)}>Gå tilbake</Button>
                        <Button style={{backgroundColor: "black", color: "white"}} onClick={() => {
                            cancelAgreement(agreementCode)
                            setCurrentPage(Pages.CANCELLED)}
                        }>Avslutt avtale</Button>
                    </ButtonWrapper>
                </CancelWrapper>
            }
            {currentPage === Pages.PAUSE &&
                <CancelWrapper>
                    <ShareTitle>Setter avtale på pause</ShareTitle>
                    <p>Velg fortsettelsesdato</p>
                    <ButtonWrapper>
                        <Button onClick={() =>  setCurrentPage(Pages.NONE)}>Gå tilbake</Button>
                        <Button style={{backgroundColor: "black", color: "white"}} onClick={() => {
                            cancelAgreement(agreementCode)
                            setCurrentPage(Pages.CANCELLED)}
                        }>Avslutt avtale</Button>
                    </ButtonWrapper>
                </CancelWrapper>
            }
            {currentPage === Pages.CANCELLED && // Move to CONFIRMATION
                <div>
                    <p>Avtalen din er nå avsluttet</p>
                </div>
            }
            {currentPage === Pages.CONFIRMATION &&
                <div>
                    {confirmChange === Changes.SUM && (
                        <div>
                            <Title>Avtalesummen din er nå endret</Title>
                            <ConfirmationText><b>Ny sum:</b> {formatCurrency((parseInt(inputPrice)/100).toString())}kr per måned</ConfirmationText>
                        </div>
                    )}
                    {confirmChange === Changes.SHARES && (
                        <div>
                            <Title>Avtalefordelingen din er nå endret</Title>
                            <ConfirmationText><b>Ny fordeling:</b></ConfirmationText>
                            <SharesDisplay KID={KID}/>
                        </div>
                    )}
                    {confirmChange === Changes.DATE && (
                        <div>
                            <Title>Trekkdagen din er nå endret</Title>
                            <ConfirmationText><b>Ny trekkdag:</b> Den {newChargeDay}. hver måned</ConfirmationText>
                            <ConfirmationText><b>Neste trekkdato:</b> {nextChargeDate}</ConfirmationText>
                        </div>
                    )}
                    {!showLoading &&
                        <Button style={{marginTop: "10px"}} onClick={() => {
                            setShowLoading(true)
                            window.location.reload()
                        }}>
                            Ok
                        </Button>
                    }
                </div>
            }
        </AgreementWrapper>
    );
}
