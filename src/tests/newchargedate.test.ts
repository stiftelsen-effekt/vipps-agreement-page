import { getNewChargeDayResults } from "../helpers/dates"

export const dayMs = 86400000
const oldDate = new Date(0)
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

/* 
  Already charged this month.
  If new charge day is less than three days after today and is due next month,
  charge as soon as possible next month (force charge 4 days in advance), 
  next month charges on new charge day.
*/
test('A', () => {
  const mockToday = new Date(0, 0, 30) // Jan 30th 1970
  const newChargeDay  = 1 // New charge day is less than 3 days away, too late to make new charge
  const monthAlreadyCharged = true
  const pendingChargeDueDate = false
  // Force charge soon as possible next month, i.e. four days ahead
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges: false, nextChargeDate: forcedChargeDate})
});

/*
  Not charged this month, no pending charge.
  New charge day is less than three days after today, (can also be before today)
  force charge in four days, (possibility of skipping charge this month if new charge day is last day of month)
  next month charges on new charge day.
*/
test('B', () => {
  const mockToday = new Date(0, 0, 15) // Jan 15th 1970
  const newChargeDay  = 16 // New charge day is less than 3 days away, too late to make new charge
  const monthAlreadyCharged = false
  const pendingChargeDueDate = false
  // Force charge soon as possible, i.e. four days ahead
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges: false, nextChargeDate: forcedChargeDate})
});

/*
  Not charged this month and there is a pending charge.
  New charge day is next month and less than three days after today, 
  cancel pending charge set next charge at today + 4 days (skips charging this month),
  next month charges on new charge day.
*/
test('C', () => {
  const mockToday = new Date(0, 0, 30) // Jan 30th 1970
  const newChargeDay  = 1 // New charge day is less than 3 days away, too late to make new charge
  const monthAlreadyCharged = false
  const pendingChargeDueDate = new Date(0, 0, 31)
  const cancelCharges = true
  // Force charge four days ahead 
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges, nextChargeDate: forcedChargeDate})
});

/*
  Not charged this month and there is a pending charge.
  New charge day is between today and three days after today,
  cancel pending charge and force charge at today + 4 days, 
  next month charges on new charge day.
*/
test('D', () => {
  const mockToday = new Date(0, 0, 15) // Jan 30th 1970
  const newChargeDay  = 16 // New charge day is less than 3 days away, too late to make new charge
  const monthAlreadyCharged = false
  const pendingChargeDueDate = new Date(0, 0, 17)
  const cancelCharges = true
  // Force charge four days ahead next month (skips charging this month)
  const forcedChargeDate = new Date(mockToday.getTime()+(dayMs*4))

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges, nextChargeDate: forcedChargeDate})
});

/*
  Not charged this month and there is a pending charge.
  New charge day is this month and more than three days after today,
  cancel pending charge.
*/
test('E', () => {
  const mockToday = new Date(0, 0, 15) // Jan 30th 1970
  const newChargeDay  = 19 // New charge day is more than 3 days away
  const monthAlreadyCharged = false
  const pendingChargeDueDate = new Date(0, 0, 17)
  const cancelCharges = true
  const nextChargeDate = new Date(mockToday.getFullYear(), mockToday.getMonth(), newChargeDay)
  const forcedChargeDate = false

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges, nextChargeDate})
});

/*
  Not charged this month and there is a pending charge.
  New charge day is before today,
  charge on pending charge due date, next month charges on new charge day
  (do nothing)
*/
test('F', () => {
  const mockToday = new Date(0, 0, 15) // Jan 30th 1970
  const newChargeDay  = 14 // New charge day is more than 3 days away
  const monthAlreadyCharged = false
  const pendingChargeDueDate = new Date(0, 0, 16)
  const cancelCharges = false
  const nextChargeDate = pendingChargeDueDate
  const forcedChargeDate = false

  const requestPayload = getNewChargeDayResults(newChargeDay, monthAlreadyCharged, pendingChargeDueDate, mockToday)
  expect(requestPayload).toEqual({newChargeDay, forcedChargeDate, cancelCharges, nextChargeDate})
});
