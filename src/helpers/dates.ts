import moment from "moment"

export const dayMs = 86400000

export function formatDate(date: Date) {
    return moment(date).format("DD.MM.YYYY")
}

export function calculateNextChargeDay(paused_until_date: string | undefined, chargeDayOfMonth: string | undefined) {

    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (paused_until_date && new Date(paused_until_date) > new Date()) {
        const nextChargeTime = new Date(paused_until_date).getTime() + (4*dayMs)
        return formatDate(new Date(nextChargeTime))
    }
    // If agreement is not paused
    else if (chargeDayOfMonth) return getNextChargeDate(chargeDayOfMonth)
}

export function getNextChargeDate(chargeDayOfMonth: string) {
    const today = new Date()

    // If the next charge date is the current month
    if (parseInt(chargeDayOfMonth) >= today.getDate()) {
        return(moment(today).format(chargeDayOfMonth + ".MM.YYYY"))
    }
    // If the next charge date is next month
    else if (parseInt(chargeDayOfMonth) < today.getDate()) {
        const monthToday = today.getMonth()

        // Month is zero indexed, hence the plus two
        // Handle December by setting January instead of adding 2 
        const nextChargeMonth = monthToday === 11 ? "1" : monthToday + 2
        return(moment(today).format(`
            ${chargeDayOfMonth.length === 1 ? "0" + chargeDayOfMonth : chargeDayOfMonth}.
            ${nextChargeMonth.toString().length === 1 ? "0" + nextChargeMonth : nextChargeMonth}.
            YYYY`).replaceAll(" ", "")
        )
    }
    return "Invalid date"
}


// Check if a date is three days ahead of today
export function isThreeDaysAhead(formattedDate: string) {
    const [dd, mm, yyyy] = formattedDate.split(".") 
    const today = new Date()
    const futureDate = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd))
    const timeDifference = futureDate.getTime() - today.getTime()
    const daysAhead = timeDifference / (1000 * 3600 * 24)
    
    console.log(daysAhead)
    if (daysAhead < 3) return false

    return true
}