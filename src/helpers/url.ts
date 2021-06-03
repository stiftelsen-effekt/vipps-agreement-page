// Extract the agreement code from the url
export function readUrl(): string {
    const urlSplit = window.location.href.split("/")
    const agreementCode = urlSplit[urlSplit.length-1]

    return agreementCode
}