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

import "./ConnectWalletButton.css";

const ConnectWalletButton = ({ className }) => {

	const { isPaymasterSupported } = useWalletContext();

	return (
		<div className={`connect-wallet-btn ${className || "flex justify-end"}`}>
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
					{isPaymasterSupported && <WalletDropdownFundLink />}
					<WalletDropdownBasename />
					<WalletDropdownDisconnect />
				</WalletDropdown>
			</Wallet>
		</div>
	);

};

export default ConnectWalletButton;
