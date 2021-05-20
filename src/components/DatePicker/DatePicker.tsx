import React, { useEffect, useState } from "react";
import { orange20 } from "../../config/colors";
import { getNextChargeDate } from "../../helpers/dates";
import { updateChargeDay } from "../../helpers/requests";
import { ButtonWrapper } from "../Agreement/Agreement.style";
import { Agreement, Changes, Pages } from "../Agreement/AgreementPage";
import { Button } from "../Shared/Buttons/Buttons.style";
import { Datebox, DateText, Wrapper } from "./DatePicker.style";

interface Props {
	agreement: Agreement | undefined;
	agreementCode: string;
	setNewChargeDay: Function;
	setCurrentPage: Function;
	setConfirmChange: Function;
}

export const DatePicker: React.FC<Props> = ({agreement, agreementCode, setNewChargeDay, setCurrentPage, setConfirmChange}) => {
	const [selectedChargeDay, setSelectedChargeDay] = useState<number>(1) // Change to string
	const [newChargeDate, setNewChargeDate] = useState<string>("")

	useEffect(() => {
		if (agreement) setSelectedChargeDay(parseInt(agreement.chargeDayOfMonth))
	}, [agreement])

	useEffect(() => {
		setNewChargeDate(getNextChargeDate(selectedChargeDay.toString()) || "")
	}, [selectedChargeDay])

	let dateBoxes: JSX.Element[] = []
	for (let i = 1; i <= 28; i++) {
		dateBoxes.push(
			<Datebox 
				key={i}
				style={{backgroundColor: selectedChargeDay === i ? orange20 : "white"}}
				onClick={() => setSelectedChargeDay(i)}
			>
				{i}
			</Datebox>
		)
	}

	return (
		<Wrapper>
			<DateText>Velg hvilken dag av måneden du trekkes</DateText>
			{dateBoxes.map(box => {return box})}
			<DateText>Neste trekkdato blir: {newChargeDate}</DateText>
			<ButtonWrapper>
				<Button onClick={() => setCurrentPage(Pages.NONE)}>
					Avbryt
				</Button>
				<Button onClick={() => {
					if (selectedChargeDay > 0 && selectedChargeDay < 29) {
						updateChargeDay(agreementCode, selectedChargeDay)
						setNewChargeDay(selectedChargeDay)
						setCurrentPage(Pages.CONFIRMATION)
						setConfirmChange(Changes.DATE)
					}
				}}>
					Lagre trekkdag
				</Button> 
            </ButtonWrapper>
		</Wrapper>
	);
};
