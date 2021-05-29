import moment from "moment"

export const dayMs = 86400000
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

export function formatDate(date: Date) {
    return moment(date).format("DD.MM.YYYY")
}

export function agreementIsPaused(paused_until_date: string) {
    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (paused_until_date && new Date(paused_until_date) > new Date()) {
        return true
    }
}

// Only called once on start up
export function getInitialNextChargeDate(
    todayDate: Date, 
    chargeDayOfMonth: number, 
    monthAlreadyCharged: boolean, 
    pausedUntilDate: string, 
    forcedChargeDate: Date
    ) {

    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (agreementIsPaused(pausedUntilDate)) {
        const nextChargeTime = new Date(pausedUntilDate).getTime() + (4*dayMs)
        return new Date(nextChargeTime)
    }

    if (monthAlreadyCharged) {
        return new Date(thisYear, thisMonth+1, chargeDayOfMonth)
    }
    if (!monthAlreadyCharged) {
        // If today is before the charge day
        if (todayDate.getDate() < chargeDayOfMonth) return new Date(thisYear, thisMonth, chargeDayOfMonth)
       // if today is past the charge day
        if (todayDate.getDate() >= chargeDayOfMonth) {
            if (isValidFutureDate(forcedChargeDate)) return new Date(forcedChargeDate)
            // No charge this month, this should not happen
            return new Date(thisYear, thisMonth+1, chargeDayOfMonth)
        }
    }

    
    return new Date()
    //return getNextChargeDate(chargeDayOfMonth, monthAlreadyCharged)
}

export function calculateNextChargeDate(paused_until_date: string, chargeDayOfMonth: string, monthAlreadyCharged: boolean) {

    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (paused_until_date && new Date(paused_until_date) > new Date()) {
        const nextChargeTime = new Date(paused_until_date).getTime() + (4*dayMs)
        return new Date(nextChargeTime)
    }
    // If agreement is not paused
    else if (chargeDayOfMonth) return getNextChargeDate(chargeDayOfMonth, monthAlreadyCharged)
}

// Called when selecting a new charge date
export function getNextChargeDate(chargeDayOfMonth: string, monthAlreadyCharged: boolean) {
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
            YYYY`).replace(/ /g, "")
        )
    }
    return "Invalid date"
}


// Check if a date is three days ahead of today
export function isThreeDaysAhead(formattedDate: string) { // Change parameter to Date
    const [dd, mm, yyyy] = formattedDate.split(".") 
    const today = new Date()
    const futureDate = new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd))
    const timeDifference = futureDate.getTime() - today.getTime()
    const daysAhead = timeDifference / (1000 * 3600 * 24)
    
    console.log(daysAhead)
    if (daysAhead < 3) return false

    return true
}


export function isValidFutureDate(input: any) {
    // Date.parse() returns NaN for all invalid dates and ms for valid dates
    const dateTime = Date.parse(input)
    if (isNaN(dateTime)) return false
    if (dateTime < new Date().getTime()) return false
    else return true
}