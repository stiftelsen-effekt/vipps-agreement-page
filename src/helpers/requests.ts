import { Share } from "../components/ShareSelection/ShareSelection";
import { API_URL } from "../config/api";

// Not in use
export function getDistributionByKID(KID: string) {
    fetch(`${API_URL}/distributions/without/donor/${KID}`)
        .then(res => res.json())
        .then((json) => {
            console.log(json)
    })
}

export function updatePrice(agreementCode: string, price: string) {
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
    })
        .then(res => res.json())
        .then((json) => {
            return json.KID
        })

    return KID
}

export function updateChargeDay(agreementCode: string, chargeDay: number) {
    const body = { agreementCode, chargeDay};
    
    fetch(`${API_URL}/vipps/agreement/chargeday`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}