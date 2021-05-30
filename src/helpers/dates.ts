import moment from "moment"

export const dayMs = 86400000
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

// Only called once when starting the app
export function getInitialNextChargeDate(
    chargeDayOfMonth: number, 
    monthAlreadyCharged: boolean, 
    pausedUntilDate: string, 
    forcedChargeDate: Date,
    todayDate: Date = new Date(), // Used for mocking today in tests
    ) {

    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (isAgreementPaused(pausedUntilDate)) {
        const nextChargeTime = new Date(pausedUntilDate).getTime() + (4*dayMs)
        return new Date(nextChargeTime)
    }

    if (monthAlreadyCharged) {
        const chargeDateNextMonth = new Date(thisYear, thisMonth+1, chargeDayOfMonth)

        // If next month has a forced charge date that is earlier than regular chargeDayOfMonth
        if (isValidFutureDate(forcedChargeDate) && forcedChargeDate < chargeDateNextMonth) {
            return forcedChargeDate
        }
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
}

// request payload for updateChargeDay() in requests.ts
export interface updateChargeDayPayload {
    newChargeDay: number;
    forcedChargeDate: Date;
    cancelCharges: boolean;
}

// Called when selecting a new charge date
export function getChargeDayPayload(
        newChargeDay: number,
        monthAlreadyCharged: boolean,
        todayDate: Date = new Date() // Used for mocking today in tests
    ): updateChargeDayPayload {
    
    let forcedChargeDate = new Date(0) // 1970, i.e. will never charge
    let cancelCharges = false
    const fourDaysAhead = new Date(todayDate.getTime()+(dayMs*4))
    
    if (monthAlreadyCharged) {
        // If next charge day is less than three days ahead in next month
        if (fourDaysAhead.getDate() <= 3) {
            // Force charge as soon as possible, i.e. four days ahead
            forcedChargeDate = fourDaysAhead
        }
    }

    if (!monthAlreadyCharged) {
        const newChargeDateThisMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), newChargeDay)
        const newChargeDateNextMonth = new Date(todayDate.getFullYear(), todayDate.getMonth()+1, newChargeDay)
        
        // If the next charge date is within three days
        if (isThreeDaysAhead(newChargeDateThisMonth, todayDate)) {
            // Force charge as soon as possible, i.e. four days ahead
        }
        // If the next charge date is within three days
        if (!isThreeDaysAhead(newChargeDateThisMonth, todayDate)) {
            // Force charge as soon as possible, i.e. four days ahead
            forcedChargeDate = fourDaysAhead
        }

        if (newChargeDay < todayDate.getDate()) {
            const monthToday = todayDate.getMonth()
    
            // Month is zero indexed, hence the plus two
            // Handle December by setting January instead of adding 2 
            /*
            const nextChargeMonth = monthToday === 11 ? "1" : monthToday + 2
            return(moment(today).format(`
                ${chargeDayOfMonth.length === 1 ? "0" + chargeDayOfMonth : chargeDayOfMonth}.
                ${nextChargeMonth.toString().length === 1 ? "0" + nextChargeMonth : nextChargeMonth}.
                YYYY`).replace(/ /g, "")
            )
            */
        }
    }
    return {newChargeDay, forcedChargeDate, cancelCharges}
}


// Probably not needed, just use formatDate on the above function
export function getFormattedNextChargeDate(chargeDayOfMonth: string, monthAlreadyCharged: boolean) {
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


/* Helper functions below */

// Check if a date is three days ahead of today
export function isThreeDaysAhead(dueDate: Date, todayDate: Date = new Date()) {
    const dd = dueDate.getDate()
    const mm = dueDate.getMonth()
    const yyyy = dueDate.getFullYear()

    const futureDate = new Date(yyyy, mm, dd)
    const timeDifference = futureDate.getTime() - todayDate.getTime()
    const daysAhead = timeDifference / (1000 * 3600 * 24)
    
    if (daysAhead < 3) return false

    return true
}

export function isValidFutureDate(input: any) {
    // Date.parse() returns NaN for all invalid dates and milliseconds for valid dates
    const dateTime = Date.parse(input)
    if (isNaN(dateTime)) return false
    if (dateTime < new Date().getTime()) return false
    else return true
}

export function formatDate(date: Date) {
    return moment(date).format("DD.MM.YYYY")
}

export function isAgreementPaused(paused_until_date: string) {
    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (paused_until_date && new Date(paused_until_date) > new Date()) {
        return true
    }
}