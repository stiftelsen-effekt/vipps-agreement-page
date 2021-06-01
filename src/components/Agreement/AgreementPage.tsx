import React, { useEffect, useState } from 'react'
import formatCurrency from '../../helpers/currency'
import { AgreementWrapper, Title, ShareTitle, ButtonWrapper, SumInputWrapper, SharesWrapper, CancelWrapper, NavigationWrapper, InfoText, ErrorText, ConfirmationText, VippsLogo } from './Agreement.style'
import { LoadingCircle } from '../Shared/LoadingCircle/LoadingCircle'
import { BlackButton, Button} from '../Shared/Buttons/Buttons.style'
import { TextInput } from '../TextInput/TextInput'
import { AgreementInfo } from './AgreementInfo'
import { cancelAgreement, pauseAgreement, unPauseAgreement, updatePrice } from '../../helpers/requests'
import { SharesDisplay } from '../ShareDisplay/ShareDisplay'
import { DatePicker } from '../DatePicker/DatePicker'
import { API_URL } from '../../config/api'
import useFetch from "react-fetch-hook"
import { formatDate, getNextChargeDate } from '../../helpers/dates'
import { SharesSelection } from '../ShareSelection/ShareSelection'
import vipps_logo from '../../images/vipps_logo.svg'
import { MonthPicker } from '../MonthPicker/MonthPicker'
import { ConfirmButton } from '../Shared/ConfirmButton/ConfirmButton'
import { readUrl } from '../../helpers/url'

export enum Pages {
    HOME,
	SHARES,
	AMOUNT,
    PAUSE,
    UNPAUSE,
    CANCEL,
    CHARGEDAY,
    CONFIRM_PAUSE,
    CONFIRM_CANCELLED,
    CONFIRM_CHARGEDAY,
    CONFIRM_AMOUNT,
    CONFIRM_SHARES,
    CONFIRM_UNPAUSE,
    ERROR
}

export interface PendingDueCharge {
    amount: number;
    due: string;
}
export interface Agreement {
    amount: number;
    status: string;
    chargeDayOfMonth: string;
    monthAlreadyCharged: boolean;
    KID: string;
    paused_until_date: string;
    forced_charge_date: string;
    pendingDueCharge: PendingDueCharge | false;
}

const agreementCode = readUrl()

export function AgreementPage() {
    const agreementRequest = useFetch<Agreement>(`${API_URL}/vipps/agreement/urlcode/${agreementCode || "none"}`);
    const [agreement, setAgreement] = useState<Agreement>()
    const [paused, setPaused] = useState<boolean>(false)
    const [nextChargeDate, setNextChargeDate] = useState<string>("")
    const [newChargeDay, setNewChargeDay] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.HOME)
    const [pausedUntilDate, setPausedUntilDate] = useState<Date>(new Date())
    const [inputPrice, setInputPrice] = useState<string>("")
    const [invalidPrice, setInvalidPrice] = useState<boolean>(false)
    const [showLoading, setShowLoading] = useState<boolean>(false)
    const [KID, setKID] = useState<string>("")
    
    useEffect(() => {
        if (agreementRequest.data) setAgreement(agreementRequest.data)
    }, [agreementRequest.data])

    useEffect(() => {
        if (agreement) {
            setKID(agreement.KID)
            setNextChargeDate(formatDate(getNextChargeDate(
                 parseInt(agreement.chargeDayOfMonth), 
                 agreement.monthAlreadyCharged,
                 agreement.paused_until_date,
                 new Date(agreement.forced_charge_date),
                 !agreement?.pendingDueCharge ? false : 
                 new Date(agreement.pendingDueCharge.due)
            )))

            // if agreement is currently paused
            if (new Date(agreement.paused_until_date) > new Date()) {
                setPaused(true)
            }
        }
    }, [agreement])

    if (agreementRequest.isLoading || showLoading) return <AgreementWrapper><LoadingCircle/></AgreementWrapper>
    if (agreement?.status === "STOPPED" || !agreement) return (
        <AgreementWrapper>
            <div>
                <VippsLogo src={vipps_logo}/>
                <ShareTitle>Denne avtalen er avsluttet eller finnes ikke</ShareTitle>
                <p>Du kan starte en ny avtale på gieffektivt.no</p>
                <BlackButton onClick={() => window.location.replace("https://gieffektivt.no")}>Gå til gieffektivt.no</BlackButton>
            </div>
        </AgreementWrapper>
    )
    
    if (agreement) {
        return (
            <AgreementWrapper>
                {currentPage === Pages.HOME && 
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        {paused ?
                            <div>
                                <ShareTitle>Denne avtalen er satt på pause til {nextChargeDate}
                                </ShareTitle>
                                <BlackButton onClick={() => setCurrentPage(Pages.UNPAUSE)}>Gjenstart avtale nå</BlackButton>
                                <BlackButton onClick={() => setCurrentPage(Pages.CANCEL)}>Avslutt avtale</BlackButton>
                            </div>
                        :
                            <NavigationWrapper>
                                <ButtonWrapper>
                                    <Button onClick={() => setCurrentPage(Pages.AMOUNT)}>Endre sum</Button>
                                    <Button onClick={() => setCurrentPage(Pages.SHARES)}>Endre fordeling</Button>
                                    <Button onClick={() => setCurrentPage(Pages.CHARGEDAY)}>Endre trekkdag</Button>
                                </ButtonWrapper>
                                <BlackButton onClick={() => setCurrentPage(Pages.PAUSE)}>Sett på pause</BlackButton>
                                <BlackButton onClick={() => setCurrentPage(Pages.CANCEL)}>Avslutt avtale</BlackButton>
                            </NavigationWrapper>
                        }
                    </div>
                }
                {currentPage === Pages.AMOUNT && 
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <SumInputWrapper>
                            <ShareTitle>Velg ny månedlig sum</ShareTitle>
                            <InfoText>Endring av sum må gjøres minst tre dager i forveien av neste trekkdato</InfoText>
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
                                {invalidPrice && <ErrorText>Ugyldig sum</ErrorText>}
                                {agreement.pendingDueCharge && <ErrorText>Neste trekk vil ikke påvirkes av denne endringen</ErrorText>}
                            </div>
                            <ButtonWrapper>
                                <Button onClick={() => setCurrentPage(Pages.HOME)}>
                                    Avbryt
                                </Button>
                                <Button onClick={() => {
                                    if (parseInt(inputPrice) > 0) {
                                        updatePrice(agreementCode, inputPrice)
                                        setCurrentPage(Pages.CONFIRM_AMOUNT)
                                    } 
                                    else setInvalidPrice(true)
                                }}>
                                    Lagre sum
                                </Button>
                            </ButtonWrapper>
                        </SumInputWrapper>
                    </div>
                }
                {currentPage === Pages.SHARES &&
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <SharesWrapper>
                            <ShareTitle>Velg ny fordeling</ShareTitle>
                            <SharesSelection
                                agreementCode={agreementCode}
                                setKID={(newKID: string) => setKID(newKID)}
                                setCurrentPage={(newPage: Pages) => setCurrentPage(newPage)}
                            />
                        </SharesWrapper>
                    </div>
                }
                {currentPage === Pages.CHARGEDAY &&
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <SharesWrapper>
                            <ShareTitle>Velg ny trekkdag</ShareTitle>
                            <DatePicker
                                agreement={agreement}
                                agreementCode={agreementCode}
                                setNewChargeDay={(day: string) => setNewChargeDay(day)}
                                setCurrentPage={(page: Pages) => setCurrentPage(page)}
                            />
                        </SharesWrapper>
                    </div>
                }
                {currentPage === Pages.CANCEL &&
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <CancelWrapper>
                            <ShareTitle>Avslutter avtale</ShareTitle>
                            <p>Avsluttede avtaler kan ikke gjenstartes,
                            hvis du ønsker å gjenstarte avtalen senere kan du sette den pause istedenfor.<br/>
                            Er du sikker på at du vil avslutte avtalen?</p>
                            <ButtonWrapper>
                                <Button onClick={() =>  setCurrentPage(Pages.HOME)}>Gå tilbake</Button>
                                <Button style={{backgroundColor: "black", color: "white"}} onClick={() => {
                                    cancelAgreement(agreementCode)
                                    setCurrentPage(Pages.CONFIRM_CANCELLED)}
                                }>Avslutt avtale</Button>
                            </ButtonWrapper>
                        </CancelWrapper>
                    </div>
                }
                {currentPage === Pages.PAUSE &&
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <CancelWrapper>
                            <ShareTitle>Setter avtale på pause</ShareTitle>
                            <MonthPicker agreement={agreement} chargeDay={agreement?.chargeDayOfMonth || ""} setPausedUntilDate={(date: Date) => setPausedUntilDate(date)} />
                            <ButtonWrapper>
                                <Button onClick={() => setCurrentPage(Pages.HOME)}>Gå tilbake</Button>
                                <Button style={{backgroundColor: "black", color: "white"}} onClick={() => {
                                    pauseAgreement(agreementCode, pausedUntilDate)
                                    setCurrentPage(Pages.CONFIRM_PAUSE)}
                                }>Sett på pause</Button>
                            </ButtonWrapper>
                        </CancelWrapper>
                    </div>
                }
                {currentPage === Pages.UNPAUSE &&
                    <div>
                        <AgreementInfo agreement={agreement} nextChargeDate={nextChargeDate}/>
                        <CancelWrapper>
                            <ShareTitle>Gjenstarter avtale</ShareTitle>
                            <p>Neste trekk etter gjenstart blir den {nextChargeDate}</p>
                            <ButtonWrapper>
                                <Button onClick={() => setCurrentPage(Pages.HOME)}>Gå tilbake</Button>
                                <Button style={{backgroundColor: "black", color: "white"}} onClick={() => {
                                    unPauseAgreement(agreementCode)
                                    setCurrentPage(Pages.CONFIRM_UNPAUSE)
                                }}>
                                    Gjenstart avtale
                                </Button>
                            </ButtonWrapper>
                        </CancelWrapper>
                    </div>
                }
                {currentPage === Pages.CONFIRM_CANCELLED && 
                    <div>
                        <p>Avtalen din er nå avsluttet</p>
                        Du er alltid velkommen til å opprette en ny avtale via vår nettside.
                    </div>
                }
                {currentPage === Pages.CONFIRM_AMOUNT && (
                    <div>
                        <Title>Avtalesummen din er nå endret</Title>
                        <ConfirmationText><b>Ny sum:</b> {formatCurrency((parseInt(inputPrice)/100).toString())}kr per måned</ConfirmationText>
                        <ConfirmButton setShowLoading={() => setShowLoading(true)} />
                    </div>
                )}
                {currentPage === Pages.CONFIRM_SHARES && (
                    <div>
                        <Title>Fordelingen din er nå endret</Title>
                        <ConfirmationText><b>Ny fordeling:</b></ConfirmationText>
                        <SharesDisplay KID={KID} />
                        <ConfirmButton setShowLoading={() => setShowLoading(true)} />
                    </div>
                )}
                {currentPage === Pages.CONFIRM_CHARGEDAY && (
                    <div>
                        <Title>Trekkdagen din er nå endret</Title>
                        <ConfirmationText><b>Ny trekkdag:</b> Den {newChargeDay}. hver måned</ConfirmationText>
                        <ConfirmationText><b>Neste trekkdato:</b> {nextChargeDate}</ConfirmationText>
                        <ConfirmButton setShowLoading={() => setShowLoading(true)} />
                    </div>
                )}
                {currentPage === Pages.CONFIRM_PAUSE && (
                    <div>
                        <Title>Avtalen din er nå satt på pause</Title>
                        <ConfirmationText>Avtalen din starter automatisk igjen den {formatDate(pausedUntilDate)}</ConfirmationText>
                        <ConfirmationText>Du er også fri til å gjenstarte avtalen når du vil</ConfirmationText>
                        <ConfirmButton setShowLoading={() => setShowLoading(true)} />
                    </div>
                )}
                {currentPage === Pages.CONFIRM_UNPAUSE && (
                    <div>
                        <Title>Avtalen din er nå gjenstartet</Title>
                        <ConfirmationText>Neste trekkdato er {(nextChargeDate)} </ConfirmationText>
                        <ConfirmButton setShowLoading={() => setShowLoading(true)} />
                    </div>
                )}
                
            </AgreementWrapper>
        )
    }
    return <div/>
}
