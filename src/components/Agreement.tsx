import React, { useEffect, useState } from 'react';
import fetch from 'node-fetch';
import moment from 'moment'
import { SharesSelection } from './ShareSelection';
import styled from 'styled-components';

 
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

export function Agreement() {
    const [agreementAmount, setAgreementAmount] = useState<Number>(0)
    const [KID, setKID] = useState<string>()
    const [distribution, setDistribution] = useState()
    const [donorID, setDonorID] = useState<number>()
    const [donorName, setDonorName] = useState<string>()
    const [nextChargeDate, setNextChargeDate] = useState<string>("")

    // try res without json
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
                    // If the current month is December then the next charge is in January
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
                <Title>Din Vipps månedlige betalingsavtale</Title>
                <Table>
                    <tbody>
                        <tr>
                            <td>Sum per måned:</td>
                            <RightCell>{agreementAmount}</RightCell>
                        </tr>
                        <tr>
                            <td>Neste trekkdato:</td>
                            <RightCell>{nextChargeDate}</RightCell>
                        </tr>
                        <tr>
                            <td>KID-nummer</td>
                            <RightCell>{KID}</RightCell>
                        </tr>
                    </tbody>
                </Table>
                <ShareTitle>Din fordeling</ShareTitle>
            </div>
            <SharesWrapper>
                <SharesSelection />
            </SharesWrapper>
        </AgreementWrapper>
    );
}

const AgreementWrapper = styled.div`
    width: 700px;
    display: flex;
    flex-direction: row;
    padding: 20px;

    @media only screen and (max-width: 750px) {
        flex-direction: column;
    }
`

const ShareTitle = styled.p`
    padding-bottom: 4px;
    border-bottom: 1px solid black;
`

const Table = styled.table`
    width: 100%;
    margin-top: 10px;
`

const RightCell = styled.td`
    text-align: right;
`

const SharesWrapper = styled.div`
    margin-left: 20px;
    width: 350px;

    @media only screen and (max-width: 750px) {
        margin-left: 0px;
    }

    @media only screen and (max-width: 450px) {
        flex-direction: column;
        width: auto;
    }
`

const Title = styled.h3`
    margin: 0;
`