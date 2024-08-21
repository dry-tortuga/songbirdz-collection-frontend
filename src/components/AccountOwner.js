import React from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import { base, baseSepolia, hardhat } from "viem/chains";

let chain = base;

if (process.env.REACT_APP_NODE_ENV === "development") {

	chain = hardhat;

} else if (process.env.REACT_APP_NODE_ENV === "staging") {

	chain = baseSepolia;

}

const AccountOwner = ({ account, size = "sm", className }) => (
	<div className={`flex h-10 items-center space-x-4 ${className || ""}`}>
		<Avatar
			address={account}
			chain={chain} />
		<div className={`ms-1 flex flex-col ${size === "sm" ? "text-sm" : ""}`}>
			<b>
				<Name
					address={account}
					chain={chain} />
			</b>
		</div>
	</div>
);

export default AccountOwner;
