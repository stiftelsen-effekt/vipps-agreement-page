import { API_URL } from "../config/api";

export function updatePrice(agreementId: string, price: string) {
    const body = { agreementId: agreementId, price: price};
    
    fetch(`${API_URL}/vipps/agreement/price`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}

export function updateChargeDate(agreementId: string, price: string) {
    const body = { agreementId: agreementId, price: price};
    
    fetch(`${API_URL}/vipps/agreement/price`, {
        method: 'put',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
}