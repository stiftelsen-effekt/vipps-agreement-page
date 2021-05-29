import React from 'react';
import { calculateNextChargeDate, getInitialNextChargeDate } from './helpers/dates';

const oldDate = new Date(0)
const todayDate = new Date()
const thisYear = new Date().getFullYear()
const thisMonth = new Date().getMonth()
const thisDay = new Date().getDate()

test('If already charged this month, next charge should be next month', () => {
  const chargeDayOfMonth  = 15
  const nextChargeDate =  getInitialNextChargeDate(new Date(), chargeDayOfMonth, true, "", oldDate)
  expect(nextChargeDate).toStrictEqual(new Date(thisYear, thisMonth+1, chargeDayOfMonth))
});

test('If not charged this month and today is before charge day', () => {
  const chargeDayOfMonth = 15
  const mockToday = new Date(0, 0, 14)
  const nextChargeDate =  getInitialNextChargeDate(mockToday, chargeDayOfMonth, false, "", oldDate)

  expect(nextChargeDate).toStrictEqual(new Date(thisYear, thisMonth, chargeDayOfMonth))
});

test('If not charged this month and today is after charge day without a forced future charge date', () => {
  const chargeDayOfMonth = 15
  const mockToday = new Date(0, 0, 16)
  const nextChargeDate =  getInitialNextChargeDate(mockToday, chargeDayOfMonth, false, "", oldDate)

  expect(nextChargeDate).toStrictEqual(new Date(thisYear, thisMonth+1, chargeDayOfMonth))
});

test('If not charged this month and future forced charge date', () => {
  const chargeDayOfMonth = 15
  const mockToday = new Date(2500, 0, 15)
  const mockFutureForcedDate = new Date(3000, 0, 16)
  const nextChargeDate =  getInitialNextChargeDate(mockToday, chargeDayOfMonth, false, "", mockFutureForcedDate)

  expect(nextChargeDate).toStrictEqual(mockFutureForcedDate)
});

