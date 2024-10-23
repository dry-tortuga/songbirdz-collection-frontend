import React, { useEffect, useState } from "react";
import { getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { 
	ConnectWallet, 
	Wallet, 
	WalletDropdown,
	WalletDropdownBasename,
	WalletDropdownDisconnect, 
	WalletDropdownFundLink,
} from "@coinbase/onchainkit/wallet";
import {
	Address,
	Avatar,
	Name,
	Identity,
	EthBalance,
} from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";

import { useWalletContext } from "../contexts/wallet";

import binosOff from "../images/binos-off.svg";
import binosOn from "../images/binos-on.svg";

import "./ConnectWalletButton.css";

const CB_DEV_PLATFORM_PROJECT_ID = process.env.REACT_APP_COINBASE_DEV_PLATFORM_PROJECT_ID;

const ConnectWalletButton = ({ className }) => {

	const { account, currentUser } = useWalletContext();

	const [countdownText, setCountdownText] = useState(null);

	const onrampBuyUrl = getOnrampBuyUrl({
		projectId: CB_DEV_PLATFORM_PROJECT_ID,
		addresses: { "0x1": ["base"] },
		assets: ["ETH"],
	});

	const tracker = currentUser?.dailyStreakTracker;

	const hasIdentifiedToday = Boolean(tracker?.today);

	useEffect(() => {

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

	}, [hasIdentifiedToday]);

	return (
		<div className={`connect-wallet-btn flex align-items-center ${className || ""}`}>
			{account &&
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
			<Wallet>
				<ConnectWallet withWalletAggregator>
					<Avatar />
					<Name />
				</ConnectWallet>
				<WalletDropdown>
					<Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
						<Avatar />
						<Name />
						<Address className={color.foregroundMuted} />
						<EthBalance />
					</Identity>
					<WalletDropdownFundLink fundingUrl={onrampBuyUrl} />
					<WalletDropdownBasename />
					<WalletDropdownDisconnect />
				</WalletDropdown>
			</Wallet>
		</div>
	);

};

export default ConnectWalletButton;
