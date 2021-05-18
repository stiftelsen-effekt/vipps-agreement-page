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
import vipps_logo from '../../images/vipps_logo.svg'
import { TextInput } from '../TextInput/TextInput'
import { API_URL } from '../../config/api'

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
    CANCELLED,
    DATE
  }

// Extract the agreement code from the url
const urlSplit = window.location.href.split("/")
const agreementID = urlSplit[urlSplit.length-1]

export function AgreementInfo() {
    const [showInput, setShowInput] = useState<Inputs>(Inputs.NONE) // Rename to pages
    const [agreementAmount, setAgreementAmount] = useState<Number>(0)
    const [KID, setKID] = useState<string>("")
    const [distribution, setDistribution] = useState()
    const [donorID, setDonorID] = useState<number>()
    const [donorName, setDonorName] = useState<string>()
    const [nextChargeDate, setNextChargeDate] = useState<string>("")

    const agreementRequest = useFetch<Agreement>(`${API_URL}/vipps/agreement/${agreementID}`);

    useEffect(() => {
        const response = agreementRequest.data
        console.log(agreementRequest.data)

        if (response) {
            setAgreementAmount(response.amount)
            setKID(response.KID)

            const today = new Date()
            const chargeDayOfMonth = response.chargeDayOfMonth

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
                setNextChargeDate(moment(today).format(`${response.chargeDayOfMonth}.${nextChargeMonth}.YYYY`))
            }
        }
    }, [agreementRequest.data])

    if (agreementRequest.isLoading) return <LoadingCircle />

    
    return (
        <div>
            <VippsLogo src={vipps_logo} />
            <Title>Din betalingsavtale med Vipps</Title>
                <Table>
                    <tbody>
                        <tr>
                            <LeftCell>Sum per måned:</LeftCell>
                            <RightCell>{formatCurrency(agreementAmount.toString())} kr</RightCell>
                        </tr>
                        <tr>
                            <LeftCell>Neste trekkdato:</LeftCell>
                            <RightCell>{nextChargeDate}</RightCell>
                        </tr>
                        <tr>
                            <LeftCell>Fordelings-ID:</LeftCell>
                            <RightCell>{KID}</RightCell>
                        </tr>
                    </tbody>
                </Table>
                
            <ShareTitle>Din fordeling</ShareTitle>
            <SharesDisplay/>
        </div>
    );
}
