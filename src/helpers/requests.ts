import { Share } from "../components/ShareSelection/ShareSelection";
import { API_URL } from "../config/api";

export async function updatePrice(agreementCode: string, price: string) {
    const body = { agreementCode, price};
    
    fetch(`${API_URL}/vipps/agreement/price`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function updateAgreementDistribution(agreementCode: string, distribution: Share[]) {
    const body = { agreementCode, distribution};
    
    const KID = await fetch(`${API_URL}/vipps/agreement/distribution`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json()).then((json) => {
        return json.KID
    })

    return KID
}

export async function updateChargeDay(agreementCode: string, chargeDay: number) {
    const body = { agreementCode, chargeDay};
    
    fetch(`${API_URL}/vipps/agreement/chargeday`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function cancelAgreement(agreementCode: string) {
    fetch(`${API_URL}/vipps/agreement/cancel/${agreementCode}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function pauseAgreement(agreementCode: string, pausedUntilDate: Date) {
    const body = {agreementCode, pausedUntilDate}

    fetch(`${API_URL}/vipps/agreement/pause`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function unPauseAgreement(agreementCode: string) {
    const body = {agreementCode}

    fetch(`${API_URL}/vipps/agreement/pause/end`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}
