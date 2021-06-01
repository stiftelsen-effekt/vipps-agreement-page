import React, { useEffect, useState } from "react";
import { orange20 } from "../../config/colors";
import { updateChargeDay } from "../../helpers/requests";
import { ButtonWrapper } from "../Agreement/Agreement.style";
import { Agreement, Pages } from "../Agreement/AgreementPage";
import { Button } from "../Shared/Buttons/Buttons.style";
import { Datebox, DateText, Wrapper } from "./DatePicker.style";

interface Props {
	agreement: Agreement | undefined;
	agreementCode: string;
	setNewChargeDay: Function;
	setCurrentPage: Function;
}

export const DatePicker: React.FC<Props> = ({agreement, agreementCode, setNewChargeDay, setCurrentPage}) => {
	const [selectedChargeDay, setSelectedChargeDay] = useState<number>(1)
	const [newChargeDate, setNewChargeDate] = useState<string>("")

	useEffect(() => {
		if (agreement) setSelectedChargeDay(parseInt(agreement.chargeDayOfMonth))
	}, [agreement])

	useEffect(() => {
		if (agreement) {
			//setNewChargeDate(getInitialNextChargeDate())
		}
	}, [agreement, selectedChargeDay])

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
			<DateText>Velg hvilken dag av måneden du vil trekkes</DateText>
			{dateBoxes.map(box => {return box})}
			<Datebox 
				key="0"
				style={{
					backgroundColor: selectedChargeDay === 0 ? orange20 : "white",
					width: "120px"
				}}
				onClick={() => setSelectedChargeDay(0)}
			>
				Siste hver måned
			</Datebox>
			<DateText>Neste trekkdato blir: {newChargeDate}</DateText>
			<ButtonWrapper>
				<Button onClick={() => setCurrentPage(Pages.HOME)}>
					Gå tilbake
				</Button>
				<Button onClick={() => {
					if (selectedChargeDay > 0 && selectedChargeDay < 29) {
						updateChargeDay(agreementCode, selectedChargeDay)
						setNewChargeDay(selectedChargeDay)
						setCurrentPage(Pages.CONFIRM_CHARGEDAY)
					}
				}}>
					Lagre trekkdag
				</Button> 
            </ButtonWrapper>
		</Wrapper>
	);
};
