import React from "react";
import { Button } from "../Buttons/Buttons.style";

interface Props {
	setShowLoading: Function;
}

export const ConfirmButton: React.FC<Props> = ({setShowLoading}) => {
	return (
		<Button style={{marginTop: "10px"}} onClick={() => {
			setShowLoading(true)
			window.location.reload()
		}}>
			Ok
		</Button>
	);
};
