import React, { useEffect, useState } from "react";

import { useWalletContext } from "../../contexts/wallet";

import binosOff from "../../images/binos-off.svg";
import binosOn from "../../images/binos-on.svg";

import { WalletConnect } from "./WalletConnect.tsx";

const ConnectWalletButton = ({ className, showDailyStreak = false }) => {

	const { account, currentUser } = useWalletContext();

	const [countdownText, setCountdownText] = useState(null);

	// const onrampBuyUrl = getOnrampBuyUrl({
	//	projectId: CB_DEV_PLATFORM_PROJECT_ID,
	//	addresses: { "0x1": ["base"] },
	//	assets: ["ETH"],
	// });

	const tracker = currentUser?.dailyStreakTracker;

	const hasIdentifiedToday = Boolean(tracker?.today);

	useEffect(() => {

		if (!showDailyStreak) { return () => { }; }

		let now = new Date();

		const endDatePlus1 = new Date(+now);

		endDatePlus1.setUTCHours(24, 0, 0, 0);

		const recheckDailyStreakTimer = () => {

			now = new Date();

			// Find the distance between now and the count down date
			const distance = endDatePlus1 - now;

			console.debug(now);

			// Time calculations for hours and minutes
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

			if (distance < 0) {

				setCountdownText(`Daily Streak: please refresh the page to see status for the next day :)`);

			} else if (hasIdentifiedToday) {

				setCountdownText(`Daily Streak (Complete): ${hours}h ${minutes}m left until the start of the next day...`);

			} else {

				setCountdownText(`Daily Streak (Missing): ${hours}h ${minutes}m left to identify a new bird today!`);

			}

		};

		// Update the count down every 1 minute
		const countdownInterval = setInterval(recheckDailyStreakTimer, 5000);

		return () => clearInterval(countdownInterval);

	}, [showDailyStreak, hasIdentifiedToday]);

	return (
		<div className={`connect-wallet-btn flex align-items-center ${className || ""}`}>
			{showDailyStreak && account &&
				<div
					className="flex align-items-center me-2"
					title={countdownText}>
					<img
						alt=""
						className="me-1"
						title={countdownText}
						src={hasIdentifiedToday ? binosOn : binosOff}
						style={{ width: 40, height: 40 }} />
					<span className={hasIdentifiedToday ? "text-info fw-bold fs-5" : "text-muted fw-bold fs-5"}>
						{hasIdentifiedToday ? tracker.login_streak : 0}
					</span>
				</div>
			}
			<WalletConnect appName="Songbirdz" />
		</div>
	);

};

export default ConnectWalletButton;
