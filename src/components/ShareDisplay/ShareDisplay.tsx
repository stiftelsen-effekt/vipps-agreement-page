import React, { useEffect, useState } from "react"
import { API_URL } from "../../config/api"
import styled from "styled-components";

interface Split {
	ID: number;
	full_name: string;
    percentage_share: string;
}

// Pie chart
// const labelStyle = {
//     fontSize: '5px',
//     fontFamily: 'sans-serif',
// };

interface Props {
    KID: string;
}

// Consider putting shares in as
export const SharesDisplay: React.FC<Props> = ({KID}) => {
	const [splits, setSplits] = useState<Split[]>()

	useEffect(() => {
        if (KID) {
            fetch(`${API_URL}/distributions/without/donor/${KID}`)
                .then(res => res.json())
                .then((json: Split[]) => {
                    setSplits(json)
                })
        }
	}, [KID])

	return (
		<div>
            <table style={{width: "100%"}}>
                <tbody>
                    <tr>
                        <LeftCell>Fordelings-ID:</LeftCell>
                        <RightCell>{KID}</RightCell>
                    </tr>
                    {splits?.map(split => {
                        return (
                            <tr key={splits.indexOf(split)}>
                                <LeftCell>{split.full_name}</LeftCell>
                                <RightCell>{parseInt(split.percentage_share).toFixed(0)}%</RightCell>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
			{/* <PieChart
                label={({ dataEntry }) => Math.round(dataEntry.percentage) + '%'}
                labelStyle={labelStyle}
                data={[
                    { title: 'One', value: 10, color: '#E38627' },
                    { title: 'Two', value: 15, color: '#C13C37' },
                    { title: 'Three', value: 20, color: '#6A2135' },
                ]}
            /> */}
		</div>
	);
};

const LeftCell = styled.td`
    padding-right: 20px;
    font-size: 14px;
    font-family: 'Roboto',Arial,sans-serif;
`

const RightCell = styled.td`
    text-align: right;
    font-size: 14px;
    font-family: 'Roboto',Arial,sans-serif;
`
