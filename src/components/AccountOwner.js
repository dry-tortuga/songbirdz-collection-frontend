import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { base } from "viem/chains";
import { useEnsName, useEnsAvatar } from "wagmi";

import { ENS_UNIVERSAL_RESOLVER, shortAddress } from "../utils/ens";
import { birdImage } from "../utils/data";

const rowStyle = {
	display: "flex",
	minHeight: "2.5rem",
	alignItems: "center",
	gap: "0.5rem",
};

// Colors for the default avatar (no basename avatar & no rarest bird)
const AVATAR_COLORS = ["#5aa9e6", "#7bc47f", "#e56b6f", "#e8a33d", "#9d7bea"];

// Shared avatar logic: the basename avatar for the address if one exists,
// otherwise the user's rarest bird, otherwise a colored initial
export const AccountAvatar = ({
	address,
	name,
	rarestBirdId,
	size = 32,
}) => {

	const { data: avatar } = useEnsAvatar({
		name,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
	});

	const avatarStyle = {
		width: size,
		height: size,
		borderRadius: "50%",
		objectFit: "cover",
		flexShrink: 0,
		border: "2px solid #333",
		boxSizing: "border-box",
	};

	if (avatar) {

		return (
			<img
				src={avatar.startsWith("ipfs://")
					? avatar.replace("ipfs://", "https://ipfs.io/ipfs/")
					: avatar}
				alt=""
				style={avatarStyle} />
		);

	}

	if (rarestBirdId !== null && rarestBirdId !== undefined) {

		return <img src={birdImage(rarestBirdId)} alt="" style={avatarStyle} />;

	}

	const charCodeSum = (address || "").split("").reduce(
		(total, char) => total + char.charCodeAt(0), 0);

	return (
		<div
			style={{
				...avatarStyle,
				background: AVATAR_COLORS[charCodeSum % AVATAR_COLORS.length],
				color: "#fff",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: 700,
				lineHeight: 1,
				fontSize: Math.round(size * 0.45),
			}}>
			{(name || shortAddress(address) || "?").charAt(0).toUpperCase()}
		</div>
	);

};

AccountAvatar.propTypes = {
	address: PropTypes.string,
	name: PropTypes.string,
	rarestBirdId: PropTypes.number,
	size: PropTypes.number,
};

// Shows an account's Base name / ENS (or short address) and links to its Profile page.
const AccountOwner = (props) => {

	const { className, user, size = "sm", showLinkToProfile = true } = props;

	const { data: name } = useEnsName({
		address: user.address,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
	});

	const content = (
		<div className={className || ""} style={rowStyle}>
			<AccountAvatar
				address={user.address}
				name={name}
				rarestBirdId={user.rarestBirdId} />
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
	user: PropTypes.shape({
		address: PropTypes.string.isRequired,
		rarestBirdId: PropTypes.number,
	}).isRequired,
	size: PropTypes.string,
	showLinkToProfile: PropTypes.bool,
};

export default AccountOwner;
