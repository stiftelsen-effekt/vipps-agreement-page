import React from 'react'
import formatCurrency from '../../helpers/currency'
import { SharesDisplay } from '../ShareDisplay/ShareDisplay'
import { Title, Table, RightCell, VippsLogo, LeftCell, ShareTitle } from './Agreement.style'
import vipps_logo from '../../images/vipps_logo.svg'
import { Agreement } from './AgreementPage'
import { formatChargeDay } from '../../helpers/dates'
interface Props {
    agreement: Agreement | undefined;
    nextChargeDate: string;
}

export const AgreementInfo: React.FC<Props> = ({agreement, nextChargeDate}) => {

    if (agreement) {
        return (
            <div>
                <VippsLogo src={vipps_logo} />
                <Title>Din betalingsavtale med gieffektivt.no</Title>
                <Table>
                    <tbody>
                        <tr>
                            <LeftCell>Sum per måned:</LeftCell>
                            <RightCell>{formatCurrency(agreement.amount ? agreement.amount.toString() : "")} kr</RightCell>
                        </tr>
                        <tr>
                            <LeftCell>Trekkdag:</LeftCell>
                            <RightCell>{formatChargeDay(agreement.chargeDayOfMonth)}</RightCell>
                        </tr>
                        <tr>
                            <LeftCell>Neste trekkdato:</LeftCell>
                            <RightCell>{nextChargeDate}</RightCell>
                        </tr>
                    </tbody>
                </Table>
                <ShareTitle>Din fordeling</ShareTitle>
                <SharesDisplay KID={agreement.KID}/>
            </div>
        );
    }
    else return <div/>
}
