import React from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import PropTypes from "prop-types";
import { base, baseSepolia, hardhat } from "viem/chains";

import { useFarcasterContext } from "../contexts/farcaster";

let chain = base;

if (process.env.REACT_APP_NODE_ENV === "development") {

	chain = hardhat;

} else if (process.env.REACT_APP_NODE_ENV === "staging") {

	chain = baseSepolia;

}

const AccountOwner = (props) => {

	const {
		className,
		user,
		size = "sm",
		showLinkToProfile = true,
	} = props;

	const { fOpenLinkToUser } = useFarcasterContext();

	if (user.farcaster) {

		return (
			<div
				className={`flex h-10 items-center space-x-4 ${className || ""}`}
				onClick={showLinkToProfile ? () => fOpenLinkToUser(user.farcaster.fid) : undefined}>
				<div className="relative">
					<div
						className="h-10 w-10 overflow-hidden rounded-full"
						data-testid="ockAvatar_ImageContainer">
						<img
							className="min-h-full min-w-full object-cover"
							data-testid="ockAvatar_Image"
							loading="lazy"
							width="100%"
							height="100%"
							decoding="async"
							src={user.farcaster.pfp_url}
							alt={`${user.farcaster.display_name}'s profile picture`} />
					</div>
				</div>
				<div className={`ms-2 flex flex-col justify-center ${size === "sm" ? "text-sm" : ""}`}>
					<span
						className="ock-font-family font-semibold ock-text-foreground"
						data-testid="ockIdentity_Text">
						{user.farcaster.display_name}
					</span>
				</div>
			</div>
		);

	}

	return (
		<div className={`flex h-10 items-center space-x-4 ${className || ""}`}>
			<Avatar
				address={user.address}
				chain={chain} />
			<div className={`ms-1 flex flex-col ${size === "sm" ? "text-sm" : ""}`}>
				<Name
					address={user.address}
					chain={chain} />
			</div>
		</div>
	);

};

AccountOwner.propTypes = {
	className: PropTypes.string,
	user: PropTypes.shape({
		address: PropTypes.string,
		farcaster: PropTypes.shape({
			fid: PropTypes.string,
			pfp_url: PropTypes.string,
			display_name: PropTypes.string
		})
	}).isRequired,
	size: PropTypes.string,
	showLinkToProfile: PropTypes.bool,
};

export default AccountOwner;
