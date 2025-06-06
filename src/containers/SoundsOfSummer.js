import React, { useCallback, useState } from "react";
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
import { encodeFunctionData } from "viem";

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

	const handleOnStatus = useCallback((status) => {

    	if (status.statusName === "success") {

    		const receipt = status.statusData.transactionReceipts?.[0];

    		if (!receipt) { return; }

    		const eventLogs =
    			receipt?.logs?.filter((log) => log.address.toLowerCase() === SOUNDS_OF_SUMMER_CONTRACT_ADDRESS.toLowerCase()) || [];

    		const events = eventLogs.map((log) => {

    			return sosInterface.parseLog({
    				data: log.data,
    				topics: log.topics,
    			});

    		// Remove any events that were not parsed correctly
    		}).filter((event) => Boolean(event));

    		// Find the event(s) from the back-end

    		const transferEvent = events.find((event) =>
    			event.name === EVENTS.TRANSFER &&
    			event.args?.from === "0x0000000000000000000000000000000000000000" &&
    			event.args?.to?.toLowerCase() === context.account.toLowerCase()
    		);

    		const tokenId = parseInt(transferEvent?.args?.tokenId, 10);

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

        } else if (status.statusName === "error") {

            console.error(status);

        }

	}, []);

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
				{!context.account &&
					<>
						<div className="text-center">
							{"Connect your wallet to get started..."}
						</div>
					</>
				}
				{context.account && !context.isOnCorrectChain &&
					<div className="text-center">
						<Button onClick={context.actions.connectToBase}>
							{'Switch to Base'}
						</Button>
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
					<Transaction
						address={context.account}
						calls={[{
						    to: SOUNDS_OF_SUMMER_CONTRACT_ADDRESS,
                            data: encodeFunctionData({
                                abi: SoundsOfSummerContract.abi,
                                functionName: "publicSongbirdzMint",
                                args: [proof],
                            })
						}]}
                        chainId={context.expectedChainId}
						isSponsored={context.isPaymasterSupported}
						onStatus={handleOnStatus}>
						<TransactionButton text="Mint"/>
						<TransactionSponsor text="SongBirdz" />
						<TransactionStatus>
							<TransactionStatusLabel />
							<TransactionStatusAction />
						</TransactionStatus>
					</Transaction>
				}
			</Container>
		</div>
	);

};

export default HiddenMint;
