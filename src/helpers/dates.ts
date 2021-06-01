import moment from "moment"

export const dayMs = 86400000
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

// Only called once when starting the app
export function getNextChargeDate(
    chargeDayOfMonth: number, 
    monthAlreadyCharged: boolean, 
    pausedUntilDate: string, 
    forcedChargeDate: Date,
    pendingChargeDueDate: Date | false,
    todayDate: Date = new Date(), // Used for mocking today in tests
    ) {

    if (pendingChargeDueDate) return pendingChargeDueDate

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
export interface NewChargeDayResults {
    newChargeDay: number;
    forcedChargeDate: Date | false;
    cancelCharges: boolean;
    nextChargeDate: Date;
}

// Called when selecting a new charge date
// Gets the results from updating the monthly charge day
export function getNewChargeDayResults(
        newChargeDay: number,
        monthAlreadyCharged: boolean,
        pendingChargeDueDate: Date | false,
        // Add pending charge date here
        todayDate: Date = new Date() // Used for mocking today in tests
    ): NewChargeDayResults {

    // 96 hours ahead of right now
    const fourDaysAhead = new Date(todayDate.getTime()+(dayMs*4))
    // Default charge day this month using the new charge day
    const newChargeDateThisMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), newChargeDay)
    // Default charge day next month using the new charge day
    const newChargeDateNextMonth = new Date(todayDate.getFullYear(), todayDate.getMonth()+1, newChargeDay)

    let forcedChargeDate: Date | false = false
    let cancelCharges = false
    let nextChargeDate = newChargeDateThisMonth
    
    if (monthAlreadyCharged) {
        if (!isThreeDaysAfterToday(newChargeDateNextMonth, todayDate)) {
            // Test A
            if (todayDate.getMonth() < fourDaysAhead.getMonth()) {
                // Force charge four days ahead
                forcedChargeDate = fourDaysAhead
                nextChargeDate = fourDaysAhead
            }
        }
    }

    if (!monthAlreadyCharged) {
        // If the new charge date is more than three days after today
        if (isThreeDaysAfterToday(newChargeDateThisMonth, todayDate)) {

            if (pendingChargeDueDate) {
                if (todayDate.getMonth() === fourDaysAhead.getMonth()) {
                    // Test E
                    cancelCharges = true
                }
            }
        }
        // If the next charge date is less three days after today
        if (!isThreeDaysAfterToday(newChargeDateThisMonth, todayDate)) {
            // Test B
            if (!pendingChargeDueDate) {
                forcedChargeDate = fourDaysAhead
                nextChargeDate = fourDaysAhead
            }

            if (pendingChargeDueDate) {
                if (newChargeDay > todayDate.getDate()) {
                    // Test D
                    cancelCharges = true
                    forcedChargeDate = fourDaysAhead
                    nextChargeDate = fourDaysAhead
                }

                if (newChargeDay <= todayDate.getDate()) {
                    // Test F
                    cancelCharges = false
                    nextChargeDate = pendingChargeDueDate
                }

                // Test C
                if (todayDate.getMonth() < fourDaysAhead.getMonth()) {
                    if (pendingChargeDueDate) {
                        cancelCharges = true
                        forcedChargeDate = fourDaysAhead
                        nextChargeDate = fourDaysAhead
                    }
                }
            }
        }
    }
    return {newChargeDay, forcedChargeDate, cancelCharges, nextChargeDate}
}

// Checks if the due date of a charge is at least three days ahead of today
export function isThreeDaysAfterToday(dueDate: Date, todayDate: Date = new Date()) {
    const dd = dueDate.getDate()
    const mm = dueDate.getMonth()
    const yyyy = dueDate.getFullYear()

    const futureDate = new Date(yyyy, mm, dd)
    const timeDifference = futureDate.getTime() - todayDate.getTime()
    const daysAhead = timeDifference / (1000 * 3600 * 24)
    
    if (daysAhead <= 3) return false
    return true
}

// Checks if the passed value is a valid Date object and is in the future
export function isValidFutureDate(input: any) {
    // Date.parse() returns NaN for all invalid dates and milliseconds for valid dates
    const dateTime = Date.parse(input)
    if (isNaN(dateTime)) return false
    if (dateTime < new Date().getTime()) return false
    else return true
}

export function isAgreementPaused(paused_until_date: string) {
    // If agreement is currently paused, next charge day is 4 days after pause ends
    if (paused_until_date && new Date(paused_until_date) > new Date()) {
        return true
    }
    return false
}

export function formatDate(date: Date) {
    return moment(date).format("DD.MM.YYYY")
}