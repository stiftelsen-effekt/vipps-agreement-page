import React, { useEffect, useState } from 'react';
import fetch from 'node-fetch';

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
    const [distribution, setDistrbution] = useState()
    const [donorID, setDonorID] = useState<number>()
    const [donorName, setDonorName] = useState<string>()

    useEffect(() => {
        fetch('http://localhost:3000/vipps/agreement/agr_fKt6UEn')
            .then(res => res.json())
            .then((json: Agreement) => {
                console.log(json)
                setAgreementAmount(json.amount)
                setDonorID(json.donorID)
            })
        /**
        fetch(`http://localhost:3000/distributions/${json.KID}`)
            .then(res => res.json())
            .then((json) => {
                console.log(json)
                if (json)
                setDistrbution(json)
            })
        */
    })

    useEffect(() => {
        if (donorID) {
            fetch(`http://localhost:3000/donors/${donorID}`)
                .then(res => res.json())
                .then((json: Donor) => {
                    console.log(json)
                    setDonorName(json.full_name)
                })
        }
    }, [donorID])
    
    return (
        <div>
            <p>Sum per måned: {agreementAmount}</p>
        </div>
    );
}
