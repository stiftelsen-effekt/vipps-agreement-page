import React, { useEffect, useState } from "react"
import { API_URL } from "../../config/api"
import { PieChart } from "react-minimal-pie-chart"

interface Split {
	ID: number;
	full_name: string;
    percentage_share: string;
}

const labelStyle = {
    fontSize: '5px',
    fontFamily: 'sans-serif',
  };

export const SharesDisplay: React.FC = () => {
	const [splits, setSplits] = useState<Split[]>()
    const [KID, setKID] = useState("")

    useEffect(() => {
        fetch('http://localhost:3000/vipps/agreement/agr_fKt6UEn')
            .then(res => res.json())
            .then((json) => {
                console.log(json)
                setKID(json.KID)
            })
    }, [])

	useEffect(() => {
        if (KID) {
            fetch(`http://localhost:3000/distributions/without/donor/${KID}`) //TODO: Replace with API_URL
                .then(res => res.json())
                .then((json: Split[]) => {
                    console.log(json)
                    setSplits(json)
                })
        }
	}, [KID])

	return (
		<div>
            {splits?.map(split => {
                return <p>{split.full_name} - {parseInt(split.percentage_share).toFixed(2)}%</p>
            })}
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
