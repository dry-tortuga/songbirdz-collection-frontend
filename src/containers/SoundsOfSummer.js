import React, { useState } from "react";
import { 
	Transaction, 
	TransactionButton, 
	TransactionSponsor, 
	TransactionStatus, 
	TransactionStatusAction, 
	TransactionStatusLabel, 
} from "@coinbase/onchainkit/transaction";
import { Interface } from "ethers";
import {
	Alert,
	Button,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import {
	simulateContract,
	waitForTransactionReceipt,
	writeContract,
} from "@wagmi/core";

import config from "../config";
import { EVENTS } from "../constants";
import { useWalletContext } from "../contexts/wallet";

import SoundsOfSummerContract from "../abi/SoundsOfSummer.json";
import soundsOfSummerMerkleTree from "../constants/sounds-of-summer-merkle-tree.json";

const SOUNDS_OF_SUMMER_CONTRACT_ADDRESS = process.env.REACT_APP_SOUNDS_OF_SUMMER_CONTRACT_ADDRESS;

const sosInterface = new Interface(SoundsOfSummerContract.abi);

const HiddenMint = () => {

	const context = useWalletContext();

	// Keep track of the transaction state after submission to the chain
	const [tx, setTx] = useState(null);

	const proof = context.account ? soundsOfSummerMerkleTree.data.find(
		(temp) => temp.address.toLowerCase() === context.account.toLowerCase()
	)?.proof : null;

	const onMintSuccess = async (response) => {

		const receipt = response.transactionReceipts?.[0];

		if (!receipt) { return; }

		console.debug('------------ onMintSuccess -----------');
		console.debug(`gasUsed=${receipt.gasUsed}`);
		console.debug(response)
		console.debug('--------------------------------------');

		const eventLogs =
			receipt?.logs?.filter((log) => log.address.toLowerCase() === SOUNDS_OF_SUMMER_CONTRACT_ADDRESS.toLowerCase()) || [];

		const events = eventLogs.map((log) => {

			return sosInterface.parseLog({
				data: log.data,
				topics: log.topics,
			});

		// Remove any events that were not parsed correctly
		}).filter((event) => Boolean(event));

		console.debug(events);

		// Find the event(s) from the back-end
		
		const transferEvent = events.find((event) =>
			event.name === EVENTS.TRANSFER &&
			event.args?.from === "0x0000000000000000000000000000000000000000" &&
			event.args?.to?.toLowerCase() === context.account.toLowerCase()
		);

		console.debug(transferEvent);

		const tokenId = parseInt(transferEvent?.args?.tokenId, 10);

		console.debug(tokenId);

		// Store the successful state for the transaction
		setTx({
			tokenId,
			receipt,
			transferEvent,
			timestamp: new Date(),
			success: true,
			// error: false,
			// errorMsg: null,
		});

	};

	const handleFreeMintNonSmartWallet = async () => {

		try {

			if (!context.isOnCorrectChain) {
				throw new Error('Double check to make sure you\'re on the Base network!');
			}

			// Store the pending state for the transaction
			setTx((prev) => Object.assign({}, prev, {
				timestamp: null,
				transaction: null,
				pending: true,
				success: false,
				error: false,
				errorMsg: null,
			}));

			const { request } = await simulateContract(config, {
				abi: SoundsOfSummerContract.abi,
				address: SOUNDS_OF_SUMMER_CONTRACT_ADDRESS,
				functionName: "publicSongbirdzMint",
				args: [proof],
				chainId: context.expectedChainId,
			});

			const hash = await writeContract(config, request);

			const receipt = await waitForTransactionReceipt(config, {
				chainId: context.expectedChainId,
				hash,
			});

			const eventLogs =
				receipt?.logs?.filter((log) => log.address.toLowerCase() === SOUNDS_OF_SUMMER_CONTRACT_ADDRESS.toLowerCase()) || [];

			const events = eventLogs.map((log) => {

				return sosInterface.parseLog({
					data: log.data,
					topics: log.topics,
				});

			// Remove any events that were not parsed correctly
			}).filter((event) => Boolean(event));

			console.debug(events);

			// Find the event(s) from the back-end
			
			const transferEvent = events.find((event) =>
				event.name === EVENTS.TRANSFER &&
				event.args?.from === "0x0000000000000000000000000000000000000000" &&
				event.args?.to?.toLowerCase() === context.account.toLowerCase()
			);

			console.debug(transferEvent);

			const tokenId = parseInt(transferEvent?.args?.tokenId, 10);

			console.debug(tokenId);

			// Store the successful state for the transaction
			setTx({
				tokenId,
				receipt,
				transferEvent,
				timestamp: new Date(),
				success: true,
				error: false,
				errorMsg: null,
			});

		} catch (error) {

			console.error(error);

			setTx((prev) => Object.assign({}, prev, {
				timestamp: new Date(),
				transaction: null,
				transferEvent: null,
				pending: false,
				success: false,
				error: true,
				errorMsg: error?.data?.message || "Oops there was an error...",
			}));

		}

	};

	return (
		<div className="about-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1 className="text-center">
							{"Sounds of Summer - Free Mint (limit 1 per address)"}
						</h1>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						<div>
							{"The Sounds Of Summer collection features an audio medley of 5 quintessential summer bird songs and a unique visualization using Base Colors. They blend the ideas of Base Colors and Songbirdz, drawing inspiration from the Soulbounds project created by 0FJAKE and apex_ether."}
						</div>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col className="col-md-4 offset-md-4">
						<img
							style={{ height: 'auto', width: '100%' }}
							src="https://cdn.mint.fun/fc14620589b06fd2d9adf4e3373c79002a306437e41eba2822cc05bc374ecd41?format=auto" />
					</Col>
				</Row>
				{!context.account &&
					<>
						<div className="text-center">
							{"Connect your wallet to get started..."}
						</div>
					</>
				}
				{context.account && !context.isOnCorrectChain &&
					<div className="text-center">
						{"Double check to make sure you're on the Base network..."}
					</div>
				}
				{context.account && !proof &&
					<div className="text-center">
						<span>{"Sorry this free mint is only available to Songbirdz holders..."}</span>
					</div>
				}
				{tx?.tokenId &&
					<Alert variant="success">
						{"Success! View your new NFT on OpenSea: "}
						<a
							href={`https://opensea.io/assets/base/0x06f2075d5a9f8ca18f7fd13b4e18f78304ec2dc7/${tx.tokenId}`}
							target="_blank"
							rel="noopener noreferrer">
							{'here'}
						</a>
						{"."}
					</Alert>
				}
				{proof && !tx?.tokenId &&
					<>
						{context.isPaymasterSupported &&
							<Transaction
								address={context.account}
								capabilities={context.isPaymasterSupported ? {
									paymasterService: { 
										url: process.env.REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT, 
									}, 
								} : null}
								contracts={[{
									abi: SoundsOfSummerContract.abi,
									address: SOUNDS_OF_SUMMER_CONTRACT_ADDRESS,
									functionName: "publicSongbirdzMint",
									args: [proof],
									chainId: context.expectedChainId,
								}]}
								onError={(error) => console.error(error)}
								onSuccess={(response) => onMintSuccess(response)}>
								<TransactionButton text="Mint"/>
								<TransactionSponsor text="SongBirdz" />
								<TransactionStatus>
									<TransactionStatusLabel />
									<TransactionStatusAction />
								</TransactionStatus>
							</Transaction>
						}
						{!context.isPaymasterSupported &&
							<Button
								className="w-100"
								variant="primary"
								onClick={handleFreeMintNonSmartWallet}>
								{"Mint"}
							</Button>
						}
					</>
				}
			</Container>
		</div>
	);

};

export default HiddenMint;
