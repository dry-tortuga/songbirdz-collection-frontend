import React, { useState } from "react";
import { Toast } from "react-bootstrap";

const DailyStreakStatus = (props) => {

	const { data, onClose } = props;

	const [isOpen, setIsOpen] = useState(true);

	const handleClose = () => {

		setIsOpen(false);

		onClose();

	};

	let header, message;

	if (!data) {
		return null;
	}

	if (data.status === "created") {

		header = "New Daily Streak";
		message = `Congrats! You've just started a new daily streak of identifying birds!`;

	} else if (data.status === "updated") {

		const pointsEarned = data.change_in_points > 0 ? ` and have earned ${data.change_in_points} points` : "";

		header = "Updated Daily Streak";
		message = `Congrats! You've just hit a ${data.login_streak} day streak of identifying birds${pointsEarned}, great job!`;

	}

	return (
		<Toast
			className="fs-6"
			bg="info"
			show={isOpen}
			onClose={handleClose}>
			<Toast.Header
				className="position-relative"
				style={{ borderRadius: 0 }}
				closeButton>
				{header}
			</Toast.Header>
			<Toast.Body className="text-white">
				<span>{message}</span>
			</Toast.Body>
		</Toast>
	);

};

export default DailyStreakStatus;
