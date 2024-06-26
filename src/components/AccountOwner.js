import React from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";

const AccountOwner = ({ account, size = "sm", className }) => (
	<div className={`flex h-10 items-center space-x-4 ${className || ""}`}>
		<Avatar	address={account} />
		<div className={`ms-1 flex flex-col ${size === "sm" ? "text-sm" : ""}`}>
			<b>
				<Name address={account} />
			</b>
		</div>
	</div>
);

export default AccountOwner;
