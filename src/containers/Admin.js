import React, { useCallback, useEffect, useState } from "react";
import {
	Transaction,
	TransactionButton,
	TransactionSponsor,
	TransactionStatus,
	TransactionStatusAction,
	TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Container } from "react-bootstrap";
import { encodeFunctionData, parseEther} from "viem";

import SongBirdzContract from "../abi/SongBirdz.json";

import { useWalletContext } from "../contexts/wallet";

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const SONGBIRDZ_CONTRACT_ADDRESS = process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS;

// const SPECIES_TO_BULK_MINT = [{
//	name: "Common Yellowthroat",
//	ids: [9212,9255,9309,9791,9903],
// }];

const SPECIES_TO_BULK_MINT = [{
	name: "Great Kiskadee",
	ids: [6257, 6334],
}, {
	name: "Thick-billed Parrot",
	ids: [6258]
}, {
	name: "Red-cockaded Woodpecker",
	ids: [6259, 6373]
}];

const Admin = () => {

	const context = useWalletContext();

	const [calls, setCalls] = useState(null);

	useEffect(() => {

		const loadCallData = async () => {

			const result = [];

			for (let i = 0; i < SPECIES_TO_BULK_MINT.length; i++) {

				for (let j = 0; j < SPECIES_TO_BULK_MINT[i].ids.length; j++) {

					// Fetch the merkle tree proof from the back-end server

					const id = SPECIES_TO_BULK_MINT[i].ids[j];

					const proofParams = new URLSearchParams({
						species_guess: SPECIES_TO_BULK_MINT[i].name,
					});

					const response = await fetch(
						`${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/merkle-proof/${id}?${proofParams}`
					);

					if (response.status !== 200) {
						throw new Error(`Unable to fetch merkle proof for bird=${id}...`);
					}

					const responseData = await response.json();

					result.push({
						to: SONGBIRDZ_CONTRACT_ADDRESS,
						value: parseEther(MINT_PRICE),
						data: encodeFunctionData({
							abi: SongBirdzContract.abi,
							functionName: "publicMint",
							args: [BigInt(id), responseData.proof, responseData.species_guess],
						}),
					});

				}

			}

			setCalls(result);

		};

		loadCallData();

	}, []);

	const handleOnStatus = useCallback((status) => {

    	if (status.statusName === "success") {

			console.log('success!');
			console.log(status);

        } else if (status.statusName === "error") {

            console.error(status);

        }

	}, []);

	if (context.account?.toLowerCase() !== "0x2d437771f6fbedf3d83633cbd3a31b6c6bdba2b1" || !calls) {
		return null;
	}

	return (
		<div className="admin-page">
			<Container className="mt-4">
				<Transaction
					address={context.account}
					calls={calls}
                    chainId={context.expectedChainId}
					isSponsored={context.isPaymasterSupported}
					onStatus={handleOnStatus}>
					<TransactionButton text="Bulk Mint"/>
					<TransactionSponsor text="SongBirdz" />
					<TransactionStatus>
						<TransactionStatusLabel />
						<TransactionStatusAction />
					</TransactionStatus>
				</Transaction>
			</Container>
		</div>
	);

};

export default Admin;
