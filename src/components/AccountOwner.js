import React from "react";
import PropTypes from "prop-types";
import { base } from "viem/chains";
import { useEnsName, useEnsAvatar } from "wagmi";
import { useFarcasterContext } from "../contexts/farcaster";

const rowStyle = {
	display: "flex",
	height: "2.5rem",
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

	const textStyle = {
		fontWeight: 600,
		fontSize: size === "sm" ? "0.875rem" : "1rem",
	};

  if (user.farcaster) {
    return (
      <div
        className={className || ""}
        style={{
          ...rowStyle,
          cursor: showLinkToProfile ? "pointer" : "default",
        }}
        onClick={
          showLinkToProfile
            ? () => fOpenLinkToUser(user.farcaster.fid)
            : undefined
        }
      >
        <img
          src={user.farcaster.pfp_url}
          alt={`${user.farcaster.display_name}'s profile picture`}
          style={avatarStyle}
        />
        <span style={textStyle}>
          {user.farcaster.display_name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={className || ""}
      style={rowStyle}
    >
      {avatar && (
        <img
          src={
            avatar.startsWith("ipfs://")
              ? avatar.replace("ipfs://", "https://ipfs.io/ipfs/")
              : avatar
          }
          alt={name ?? user.address}
          style={avatarStyle}
        />
      )}
      <span style={textStyle}>
        {name || `${user.address.slice(0, 8)}...${user.address.slice(-3)}`}
      </span>
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
			display_name: PropTypes.string,
		}),
	}).isRequired,
	size: PropTypes.string,
	showLinkToProfile: PropTypes.bool,
};

export default AccountOwner;
