import { getChargeDayPayload } from "../helpers/dates"

export const dayMs = 86400000
const oldDate = new Date(0)
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

test('Month already charged and new charge day is less than three days ahead of today and lands on next month', () => {
  const mockToday = new Date(0, 0, 30) // Jan 30th 1970
  const newChargeDay  = 1 // New charge day is less than 3 days away, too late to make new charge
  // Force charge soon as possible next month, i.e. four days ahead
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getChargeDayPayload(newChargeDay, true, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges: false})
});

test('Not charged this month, new charge day is less than three days ahead', () => {
  const mockToday = new Date(0, 0, 15) // Jan 15th 1970
  const newChargeDay  = 16 // New charge day is less than 3 days away, too late to make new charge
  // Force charge soon as possible this month, i.e. four days ahead
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getChargeDayPayload(newChargeDay, false, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges: false})
});