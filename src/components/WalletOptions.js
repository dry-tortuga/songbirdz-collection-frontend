import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Connector, useConnect } from "wagmi";

import coinbaseLogo from "../images/logo-coinbase-wallet.png";
import metamaskLogo from "../images/logo-metamask-wallet.png";
import walletConnectLogo from "../images/logo-wallet-connect.svg";

const WalletOptions = () => {
 
	const { connectors, connect } = useConnect();

	// Filter out the smart wallet from the list of connection options
	const finalConnectors = connectors.filter(
		(connector) => connector.id !== "coinbaseWalletSDK"
	);

	return finalConnectors.map((connector) => (
		<WalletOption
			key={connector.uid}
			connector={connector}
			onClick={() => connect({ connector })}
		/>
	));

}

const WalletOption = ({ connector, onClick }) => {

	const [ready, setReady] = React.useState(false)

	useEffect(() => {

		const isReady = async () => {

			const provider = await connector.getProvider();
			setReady(Boolean(provider));

		};

		isReady();

	}, [connector])

	let icon = connector.icon;
	let iconSize = 50;

	if (!icon && connector.id === "metaMaskSDK") {

		icon = metamaskLogo;

	} else if (!icon && connector.id === "com.coinbase.wallet") {

		icon = coinbaseLogo;

	} else if (!icon && connector.id === "walletConnect") {

		icon = walletConnectLogo;
		iconSize = 75;

	}

	return (
		<Button
			className="d-flex align-items-center"
			variant="outline"
			w="100%"
			disabled={!ready}
			onClick={onClick}>
			<img
				className="me-3"
				alt=""
				src={icon}
				style={{ width: iconSize, height: iconSize }} />
			{connector.name}
		</Button>
	);

};

export default WalletOptions;
