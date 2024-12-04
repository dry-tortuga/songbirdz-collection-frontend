import React from "react";

import ConnectWalletButton from "./ConnectWalletButton";

import { useWalletContext } from "../contexts/wallet";

const WalletConnectionStatus = () => {
    const context = useWalletContext();

    if (!context.account) {
        return <ConnectWalletButton />;
    }

    if (!context.isOnCorrectChain) {
        return (
            <span>
                {"Double check to make sure you're on the Base network..."}
            </span>
        );
    }

    return null;
};

export default WalletConnectionStatus;
