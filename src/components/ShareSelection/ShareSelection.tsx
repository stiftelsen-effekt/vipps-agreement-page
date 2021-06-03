import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Validator from "validator";
import { API_URL } from "../../config/api";
import { updateAgreementDistribution } from "../../helpers/requests";
import { ButtonWrapper } from "../Agreement/Agreement.style";
import { Pages } from "../Agreement/AgreementPage";
import { Button } from "../Shared/Buttons/Buttons.style";
import { RedFont } from "./ShareSelection.style";
import { TextInput } from "../TextInput/TextInput";

export interface Organization {
	abbriv: string;
	name: string;
	id: number;
	infoUrl: string;
	shortDesc: string;
	standardShare: number;
}

export interface OrganizationResponse {
	content: Organization[];
}

export interface Share {
	organizationId: number;
	share: number;
}

interface Props {
	agreementCode: string;
	setKID: Function;
	setCurrentPage: Function;
}

export const SharesSelection: React.FC<Props> = ({agreementCode, setKID, setCurrentPage}) => {
	const [organizations, setOrganizations] = useState<Organization[]>()
	const [shares, setShares] = useState<Share[]>([])
	const [sumPercentage, setSumPercentage] = useState<number>()

	useEffect(() => {
		fetch(`${API_URL}/organizations/active`)
			.then(res => res.json())
			.then((json: OrganizationResponse) => {
				setOrganizations(json.content)
			})
	}, [])

	useEffect(() => {
		let newShares: Share[] = []
		organizations?.forEach(org => {
			newShares.push({organizationId: org.id, share: 0})
		})
		setShares(newShares)
	}, [organizations])

	useEffect(() => {
		if (shares) setSumPercentage(shares.reduce((acc, curr) => acc + curr.share, 0))
	}, [shares])

	if (!organizations) return <div>Ingen organisasjoner</div>

	return (
		<Wrapper>
			<div>
				{shares && shares.map((share: Share) => (
					<div key={share.organizationId}>
						<TextInput
							label={organizations.filter((org) => org.id === share.organizationId)[0].name}
							tooltipText={
								organizations.filter((org) => org.id === share.organizationId)[0].shortDesc
							}
							key={share.organizationId}
							type="tel"
							inputMode="numeric"
							placeholder="0"
							value={share.share.toString()}
							onChange={(e) => {
								const newShares = [...shares]
								const index = newShares.map((s) => {
									return s.organizationId
								}).indexOf(share.organizationId);
								
								newShares[index].share = Validator.isInt(e.target.value)
									? parseInt(e.target.value)
									: 0;
								setShares(newShares)
							}}
							denomination="%"
							selectOnClick
						/>
					</div>
				))}
			</div>
			{sumPercentage === 100 ? null :<RedFont>{`Du har fordelt ${sumPercentage} av 100 prosent`}</RedFont>}
			<ButtonWrapper>
				<Button onClick={() => setCurrentPage(Pages.HOME)}>
					Avbryt
				</Button>
				<Button onClick={async () => {
					if (sumPercentage === 100) {
						const filteredShares = shares.filter(share => share.share > 0)
						const newKID = await updateAgreementDistribution(agreementCode, filteredShares)
						setKID(newKID)
						setCurrentPage(Pages.CONFIRM_SHARES)
					}
				}}>
					Lagre fordeling
				</Button> 
            </ButtonWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 10px;
	width: 100%;
`
