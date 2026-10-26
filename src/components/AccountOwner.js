import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { base } from "viem/chains";
import { useEnsName, useEnsAvatar } from "wagmi";

import { ENS_UNIVERSAL_RESOLVER, shortAddress } from "../utils/ens";

const rowStyle = {
	display: "flex",
	minHeight: "2.5rem",
	alignItems: "center",
	gap: "0.5rem",
};

const avatarStyle = {
	width: 32,
	height: 32,
	borderRadius: "50%",
	objectFit: "cover",
	flexShrink: 0,
};

// Shows an account's Base name / ENS (or short address) and links to its Profile page.
const AccountOwner = (props) => {

	const { className, user, size = "sm", showLinkToProfile = true } = props;

	const { data: name } = useEnsName({
		address: user.address,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
	});

	const { data: avatar } = useEnsAvatar({
		name,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
	});

	const content = (
		<div className={className || ""} style={rowStyle}>
			{avatar &&
				<img
					src={avatar.startsWith("ipfs://")
						? avatar.replace("ipfs://", "https://ipfs.io/ipfs/")
						: avatar}
					alt=""
					style={avatarStyle} />
			}
			<span style={{ fontWeight: 600, fontSize: size === "sm" ? "0.875rem" : "1rem" }}>
				{name || shortAddress(user.address)}
			</span>
		</div>
	);

	if (!showLinkToProfile) { return content; }

	return (
		<Link
			to={`/profile/${user.address.toLowerCase()}`}
			style={{ textDecoration: "none" }}
			title="View Life List">
			{content}
		</Link>
	);

};

AccountOwner.propTypes = {
	className: PropTypes.string,
	user: PropTypes.shape({ address: PropTypes.string.isRequired }).isRequired,
	size: PropTypes.string,
	showLinkToProfile: PropTypes.bool,
};

export default AccountOwner;