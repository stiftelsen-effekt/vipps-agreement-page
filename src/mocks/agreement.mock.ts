import { Agreement } from "../components/Agreement/AgreementPage";

// KID owned by anon@gieffektivt.no
const anonKID = "39354444"

export const agreementPaused: Agreement = {
    amount: 500,
    status: "ACTIVE",
    chargeDayOfMonth: "15",
    monthAlreadyCharged: true,
    KID: anonKID,
    paused_until_date: new Date(3000, 1, 1).toString()
}

export const agreementDay1: Agreement = {
    amount: 500,
    status: "ACTIVE",
    chargeDayOfMonth: "1",
    monthAlreadyCharged: true,
    KID: anonKID, 
    paused_until_date: ""
}

export const agreementDay28: Agreement = {
    amount: 500,
    status: "ACTIVE",
    chargeDayOfMonth: "28",
    monthAlreadyCharged: true,
    KID: anonKID,
    paused_until_date: ""
}

export const agreementDayLast: Agreement = {
    amount: 500,
    status: "ACTIVE",
    chargeDayOfMonth: "0",
    monthAlreadyCharged: true,
    KID: anonKID, // KID owned by anon@gieffektivt.no
    paused_until_date: ""
}
