import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { useConnect } from "wagmi";

import CreateWalletLogo from "./CreateWalletLogo";
 
const CreateWalletButton = () => {

	const { connectors, connect } = useConnect();

	const createWallet = useCallback(() => {

		const coinbaseWalletConnector = connectors.find(
			(connector) => connector.id === "coinbaseWalletSDK"
		);

		console.log(coinbaseWalletConnector);

		if (coinbaseWalletConnector) {
			connect({ connector: coinbaseWalletConnector });
		}

	}, [connectors, connect]);
 
	return (
		<Button
			variant="primary"
			onClick={createWallet}>
			<div className="d-flex align-items-center">
				<CreateWalletLogo containerStyles={{ paddingRight: 10 }} />
				{"Create Wallet"}
			</div>
		</Button>
	);

};

export default CreateWalletButton;
