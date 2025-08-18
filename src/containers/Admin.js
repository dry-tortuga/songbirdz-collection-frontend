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
	name: "Sharp-tailed Grouse",
	ids: [8184],
}, {
	name: "Connecticut Warbler",
	ids: [8183],
}, {
	name: "Eurasian Siskin",
	ids: [8190,8243],
}, {
	name: "Mexican Whip-poor-will",
	ids: [8198],
}, {
	name: "Common Nighthawk",
	ids: [8200],
}, {
	name: "Buff-breasted Sandpiper",
	ids: [8204],
}, {
	name: "Akikiki",
	ids: [8205], // 7
}, {
	name: "Curlew Sandpiper",
	ids: [8217],
}, {
	name: "Fork-tailed Storm-Petrel",
	ids: [8231],
}, {
	name: "Pacific Wren",
	ids: [8258,8313],
}, {
	name: "Northern Waterthrush",
	ids: [8260],
}, {
	name: "Spruce Grouse",
	ids: [8262],
}, {
	name: "Dusky Warbler",
	ids: [8270],
}, {
	name: "Red-naped Sapsucker",
	ids: [8284],
}, {
	name: "Arizona Woodpecker",
	ids: [8298],
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
							args: [
								BigInt(id),
								responseData.proof,
								responseData.species_guess,
							],
						}),
					});

					result.push({
						to: SONGBIRDZ_CONTRACT_ADDRESS,
						data: encodeFunctionData({
							abi: SongBirdzContract.abi,
							functionName: "safeTransferFrom",
							args: [
								context.account,
								// "0x585D3eF48e12cb1be6837109b0853afe78B5eBE3",
								"0x61d082120f622e22e491e6eb42dcc7fb0e39288e",
								BigInt(id),
							],
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
