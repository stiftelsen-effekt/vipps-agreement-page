import React, { useEffect, useState } from 'react'
import fetch from 'node-fetch'
import moment from 'moment'
import { SharesSelection } from '../ShareSelection/ShareSelection'
import formatCurrency from '../../helpers/currency'
import { SharesDisplay } from '../ShareDisplay/ShareDisplay'
import useFetch from "react-fetch-hook"
import { AgreementWrapper, Title, Table, RightCell, ShareTitle, ButtonWrapper, SumInputWrapper, StyledSumInput, SharesWrapper, CancelWrapper, NavigationWrapper, VippsLogo, LeftCell } from './Agreement.style'
import vipps_logo from '../../images/vipps_logo.svg'
import { Agreement } from './AgreementPage'
import { getNextChargeDate } from '../../helpers/dates'
interface Props {
    agreement: Agreement | undefined;
    nextChargeDate: string;
}

export const AgreementInfo: React.FC<Props> = ({agreement, nextChargeDate}) => {

    return (
        <div>
            <VippsLogo src={vipps_logo} />
            <Title>Din betalingsavtale med gieffektivt.no</Title>
            <Table>
                <tbody>
                    <tr>
                        <LeftCell>Sum per måned:</LeftCell>
                        <RightCell>{formatCurrency(agreement ? agreement.amount.toString() : "")} kr</RightCell>
                    </tr>
                    <tr>
                        <LeftCell>Trekkdag:</LeftCell>
                        <RightCell>Den {agreement?.chargeDayOfMonth}. hver måned</RightCell>
                    </tr>
                    <tr>
                        <LeftCell>Neste trekkdato:</LeftCell>
                        <RightCell>{nextChargeDate}</RightCell>
                    </tr>
                </tbody>
            </Table>
            <ShareTitle>Din fordeling</ShareTitle>
            <SharesDisplay KID={agreement ? agreement.KID : ""}/>
        </div>
    );
}
