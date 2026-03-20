import React from "react";
import PropTypes from "prop-types";
import { base } from "viem/chains";
import { useEnsName, useEnsAvatar } from "wagmi";

import { useFarcasterContext } from "../contexts/farcaster";

const AccountOwner = (props) => {

	const {
		className,
		user,
		size = "sm",
		showLinkToProfile = true,
	} = props;

	const { fOpenLinkToUser } = useFarcasterContext();

	const { data: name } = useEnsName({
		address: user.address,
		chainId: base.id,
		universalResolverAddress: "0xC6d566A56A1aFf6508b41f6c90ff131615583c7",
	});

	const { data: avatar } = useEnsAvatar({
		name,
		chainId: base.id,
		universalResolverAddress: "0xC6d566A56A1aFf6508b41f6c90ff131615583c7",
	});

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
			{avatar && (
				<img
					src={avatar.startsWith("ipfs://")
						? avatar.replace("ipfs://", "https://ipfs.io/ipfs/")
						: avatar}
					alt={name ?? user.address}
					style={{
						width: 32,
						height: 32,
						borderRadius: "50%",
						objectFit: "cover",
					}} />
			)}
			<div className={`ms-1 flex flex-col ${size === "sm" ? "text-sm" : ""}`}>
				{name || user.address}
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
