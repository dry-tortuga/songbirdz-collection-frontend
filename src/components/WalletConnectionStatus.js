import React from "react";
import { Button } from 'react-bootstrap';

import ConnectWalletButton from "./ConnectWalletButton";

import { useWalletContext } from "../contexts/wallet";

const WalletConnectionStatus = () => {

    const { account, isOnCorrectChain, actions } = useWalletContext();

    if (!account) {
        return <ConnectWalletButton />;
    }

    if (!isOnCorrectChain) {
        return (
			<Button
				variant="info"
				onClick={actions.connectToBase}>
				{'Switch to Base'}
			</Button>
        );
    }

    return null;

};

export default WalletConnectionStatus;
