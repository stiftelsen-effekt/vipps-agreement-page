import React, { useEffect, useState } from "react";
import { orange20 } from "../../config/colors";
import { formatDate } from "../../helpers/dates";
import { Datebox, DateText, Wrapper } from "./MonthPicker.style";

interface Props {
	chargeDay: string;
	setPausedUntilDate: Function;
}

export const MonthPicker: React.FC<Props> = ({chargeDay, setPausedUntilDate}) => {
	const [nextChargeDate, setNextChargeDate] = useState<string>("")
	const [pauseDuration, setPauseDuration] = useState<number>(1)
	const currentYear = new Date().getFullYear()
	const currentMonth = new Date().getMonth()
	const currentDay = new Date().getDate()


	useEffect(() => {
	 	setNextChargeDate(formatDate(new Date(
			 currentYear, 
			 // If already charged this month, set next charge date one month later
			 currentMonth + (currentDay >= parseInt(chargeDay) ? 1 : 0) + pauseDuration, 
			 parseInt(chargeDay))))
	 }, [currentYear, currentMonth, chargeDay, currentDay, pauseDuration])

	let dateBoxes: JSX.Element[] = []
	for (let i = 1; i <= 12; i++) {
		dateBoxes.push(
			<Datebox 
				key={i}
				style={{backgroundColor: pauseDuration === i ? orange20 : "white"}}
				onClick={() => {
					setPauseDuration(i)
					console.log(new Date(currentYear, currentMonth + i, parseInt(chargeDay) - 4 ))
					// End pause 4 days prior to the next charge day, to make time for creating next charge on schedule
					setPausedUntilDate(new Date(currentYear, currentMonth + i, parseInt(chargeDay) - 4))
				}}
			>
				{i}
			</Datebox>
		)
	}

	return (
		<Wrapper>
			<DateText>Velg varigheten av pausen din i antall måneder</DateText>
			{dateBoxes.map(box => {return box})}
			<DateText>Neste trekkdato blir: {nextChargeDate}</DateText>
		</Wrapper>
	);
};
