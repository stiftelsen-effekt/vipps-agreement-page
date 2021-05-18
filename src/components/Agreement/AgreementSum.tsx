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

export function AgreementSum() {
    
    return (
        <div style={{width: "100%", paddingTop: "10px", paddingBottom: "10px"}}> 
            <TextInput
                label="Sum"
                denomination="kr"
                name="sum"
                type="tel"
                placeholder="0"
                defaultValue="0"
            />
        </div>
    );
}
