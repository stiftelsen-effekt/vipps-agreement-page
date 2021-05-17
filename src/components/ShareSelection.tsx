import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Validator from "validator";
import { API_URL } from "../config/api";
import { RedFont } from "./ShareSelection.style";
import { TextInput } from "./TextInput/TextInput";

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
	orgId: number;
	split: number;
}

export const SharesSelection: React.FC = () => {
	const [organizations, setOrganizations] = useState<Organization[]>()
	const [shares, setShares] = useState<Share[]>()
	const [sumPercentage, setSumPercentage] = useState<number>()

	useEffect(() => {
		fetch(`http://localhost:3000/organizations/active`)
			.then(res => res.json())
			.then((json: OrganizationResponse) => {
				console.log(json.content)
				setOrganizations(json.content)
			})
	}, [])

	useEffect(() => {
		let newShares: Share[] = []
		organizations?.forEach(org => {
			newShares.push({orgId: org.id, split: 0})
		})
		setShares(newShares)
	}, [organizations])

	useEffect(() => {
		if (shares) setSumPercentage(shares.reduce((acc, curr) => acc + curr.split, 0))
	}, [shares])

	if (!organizations) return <div>Ingen organisasjoner</div>

	return (
		<Wrapper>
			<div>
				{shares && shares.map((share: Share) => (
					<div key={share.orgId}>
						<TextInput
							label={organizations.filter((org) => org.id === share.orgId)[0].name}
							tooltipText={
								organizations.filter((org) => org.id === share.orgId)[0].shortDesc
							}
							key={share.orgId}
							type="number"
							inputMode="numeric"
							placeholder="0"
							value={share.split.toString()}
							onChange={(e) => {
								const newShares = [...shares]
								const index = newShares
									.map((s) => {
										return s.orgId
									})
									.indexOf(share.orgId);
								newShares[index].split = Validator.isInt(e.target.value)
									? parseInt(e.target.value)
									: 0;
								setShares(newShares)
								console.log(newShares)
							}}
							denomination="%"
							selectOnClick
						/>
					</div>
				))}
			</div>
			{sumPercentage === 100 ? null :<RedFont>{`Du har fordelt ${sumPercentage} av 100 prosent`}</RedFont>}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 20px;
	width: 300px;

	@media only screen and (max-width: 355px) {
		width: 250px;
  	}
`
