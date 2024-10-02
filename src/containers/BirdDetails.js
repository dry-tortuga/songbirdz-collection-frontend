import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	ListGroup,
	Row,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import AccountOwner from "../components/AccountOwner";
import BirdAudioFile from "../components/BirdAudioFile";
import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";
import BirdIdentificationTransactionStatusNonSmartWallet from "../components/BirdIdentificationTransactionStatusNonSmartWallet";
import ConnectWalletButton from "../components/ConnectWalletButton";

import { COLLECTIONS, EVENTS } from "../constants";

import useBird from "../hooks/useBird";
import useMintAPINonSmartWallet from "../hooks/useMintAPINonSmartWallet";

import etherscanLogo from "../images/etherscan-logo-circle.svg";
import openseaLogo from "../images/opensea-logomark-blue.svg";

import { populateMetadata } from "../utils/data";

import "./BirdDetails.css";

const BirdDetails = () => {

	const context = useWalletContext();

	const params = useParams();

	// Get the bird details
	const [bird, setBird] = useBird({
		context,
		id: parseInt(params.id, 10),
	});

	// True, if the modal is open
	const [isIdentifyingBird, setIsIdentifyingBird] = useState(false);

	// Keep track of the transaction state after submission to the chain
	const [tx, setTx] = useState(null);

	// Keep track of the state of the info alert
	const [showInfoAlert, setShowInfoAlert] = useState(true);

	const onMintSuccess = async (response) => {

		const receipt = response.transactionReceipts?.[0];

		if (!receipt) { return; }

		console.debug('------------ onMintSuccess -----------');
		console.debug(`gasUsed=${receipt.gasUsed}`);
		console.debug(response)
		console.debug('--------------------------------------');

		const transactionHash = receipt.transactionHash;

		const eventLogs =
			receipt?.logs?.filter((log) => log.address.toLowerCase() === context.contractAddress.toLowerCase()) || [];

		const events = eventLogs.map((log) => {

			return context.contractInterface.parseLog({
				data: log.data,
				topics: log.topics,
			});

		// Remove any events that were not parsed correctly
		}).filter((event) => Boolean(event));

		console.debug(events);

		// Find the event(s) from the back-end

		const idEvent = events.find((event) =>
			event.name === EVENTS.BIRD_ID &&
			parseInt(event.args?.birdId, 10) === bird.id &&
			event.args?.user?.toLowerCase() === context.account.toLowerCase()
		);

		const transferEvent = events.find((event) =>
			event.name === EVENTS.TRANSFER &&
			event.args?.from === "0x0000000000000000000000000000000000000000" &&
			event.args?.to?.toLowerCase() === context.account.toLowerCase() &&
			parseInt(event.args?.tokenId, 10) === bird.id
		);

		// Check if the user successfully identified the bird, i.e. is now the owner
		if (transferEvent) {

			const updatedData = { ...bird, owner: context.account };

			const finalData = await populateMetadata(updatedData);

			setBird(finalData);

		}

		// Store the successful state for the transaction
		setTx({
			transactionHash,
			receipt,
			idEvent,
			transferEvent,
			timestamp: new Date(),
			success: true,
			// error: false,
			// errorMsg: null,
		});

	};

	const onMintSuccessNonSmartWallet = async (idEvent, transferEvent) => {

		// Check if the user successfully identified the bird, i.e. is now the owner
		if (transferEvent) {

			const updatedData = { ...bird, owner: context.account };

			const finalData = await populateMetadata(updatedData);

			setBird(finalData);

		}

	};

	const [
		handleMintBirdNonSmartWallet,
		txMintBirdNonSmartWallet,
		resetTxMintBirdNonSmartWallet,
	] = useMintAPINonSmartWallet({
		context,
		cb: onMintSuccessNonSmartWallet,
	});

	// Re-load the twitter share button if the bird ID changes
	useEffect(() => {

		if (bird && window.twttr && window.twttr.widgets) {

			window.twttr.widgets.load(
				document.getElementById("details-page")
			);

		}

	}, [bird?.id]);

	const collection = bird ? COLLECTIONS[bird.collection] : null;

	if (bird && (bird.id < COLLECTIONS[0].min_id || bird.id > COLLECTIONS[3].max_id)) {
		return null;
	}

	console.debug("-------------- BirdDetails -----------");
	console.debug(bird);
	console.debug("--------------------------------------")

	return (
		<div
			id="details-page"
			className="details-page">
			<Container className="my-4">
				{!context.account &&
					<>
						<div className="text-center">
							{"Connect your wallet to get started..."}
						</div>
						<ConnectWalletButton className="flex d-md-none justify-center mt-3" />
					</>
				}
				{context.account &&
					context.isOnCorrectChain &&
					!bird &&
					<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
				}
				{context.account && !context.isOnCorrectChain &&
					<span className="me-1">
						{"Double check to make sure you're on the Base network..."}
					</span>
				}
				{bird &&
					<>
						<Row className="mb-3">
							<Col className="d-flex align-items-center flex-wrap">
								<h1 className="d-flex align-items-center">
									{bird.name}
								</h1>
								{bird.id > COLLECTIONS[0].min_id &&
									<Link
										className="btn btn-outline-primary ms-3"
										to={`/collection/${bird.id - 1}`}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-arrow-left"
											viewBox="0 0 16 16">
											<path
												fillRule="evenodd"
												d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
										</svg>
									</Link>
								}
								{bird.id < COLLECTIONS[3].max_id &&
									<Link
										className="btn btn-outline-primary ms-3"
										to={`/collection/${bird.id + 1}`}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-arrow-right"
											viewBox="0 0 16 16">
											<path
												fillRule="evenodd"
												d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
										</svg>
									</Link>
								}
								{bird.owner &&
									<div
										className="flex align-items-center ms-auto"
										key={bird.id}>
										<a
											href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this ${bird.species} in the @songbirdz_cc collection on @base from @dry_tortuga!\n\n Try onchain bird watching today at https://songbirdz.cc/collection?hide_already_identified=true\n\n`)}`}
											className="twitter-share-button"
											data-show-count="false"
											data-size="large"
											data-hashtags="basedbirds"
											data-via="opensea"
											data-url={`https://opensea.io/assets/base/${context.contractAddress}/${bird.id}`}>
											{"Tweet"}
										</a>
										<a
											className="btn btn-clear ms-3"
											href={`https://opensea.io/assets/base/${context.contractAddress}/${bird.id}`}
											rel="noopener noreferrer nofollow"
											target="_blank">
											<img
												alt=""
												src={openseaLogo}
												style={{ width: '35px', height: 'auto' }} />
										</a>
										<a
											className="btn btn-clear"
											href={`https://basescan.org/token/${context.contractAddress}?a=${bird.id}`}
											rel="noopener noreferrer nofollow"
											target="_blank">
											<img
												alt=""
												src={etherscanLogo}
												style={{ width: '35px', height: 'auto' }} />
										</a>
									</div>
								}
							</Col>
						</Row>
						{!bird.owner && showInfoAlert &&
							<Row className="mb-3">
								<Col>
									<Alert
										variant="info"
										dismissible
										onClose={() => setShowInfoAlert(false)}>
										<p className="mb-1"><b>{'1. '}</b>{'View the image and listen to the audio recording of the bird\'s song.'}</p>
										<p className="mb-1"><b>{'2. '}</b>{'Click on the "Identify" button and submit your guess for the correct species of the bird from a list of 5 answer choices.'}</p>
										<p className="mb-0"><b>{'3. '}</b>{'If you\'re correct, you\'ll be the new owner of the bird!'}</p>
									</Alert>
								</Col>
							</Row>
						}
						{/*
							<Alert variant="success">
								<p className="mb-1"><b>{'The "Deep Blue" flock of Songbirdz is now 100% identified... but stay tuned for details about the release of the 3rd flock of 1,000 birds!'}</b></p>
								<p className="mb-1">
									<span className="me-1">
										{"Follow on"}
									</span><a
									href="https://twitter.com/songbirdz_cc"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Twitter"}
								</a></p>
								<p className="mb-1">
									<span className="me-1">
										{"Join the"}
									</span>
									<a
									href="https://discord.gg/UKGgRsJXzr"
									target="_blank"
									rel="noopener noreferrer nofollower">
									{"Discord"}
								</a></p>
							</Alert>
						*/}
						{/* Smart Wallet Users */}
						{tx &&
							<Row className="mb-3">
								<Col>
									<BirdIdentificationTransactionStatus
										tx={tx}
										onClose={() => setTx(null)} />
								</Col>
							</Row>
						}
						{/* Non-Smart Wallet Users */}
						{(txMintBirdNonSmartWallet?.pending || txMintBirdNonSmartWallet?.success || txMintBirdNonSmartWallet?.error) &&
							<Row className="mb-3">
								<Col>
									<BirdIdentificationTransactionStatusNonSmartWallet
										tx={txMintBirdNonSmartWallet}
										onClose={resetTxMintBirdNonSmartWallet} />
								</Col>
							</Row>
						}
						<Row>
							<Col>
								<Card>
									<Row>
										<img
											key={bird.imageLg}
											alt=""
											className="col-12 col-sm-6 col-md-4"
											src={bird.imageLg}
											srcSet={`${bird.image} 256w, ${bird.imageLg} 768w`}
											sizes="(max-width: 576px) 256px, 768px" />
										<Card.Body className="col-12 col-sm-6 col-md-8 d-flex flex-column">
											<Card.Title
												as="h2"
												className="ms-3 ms-md-0">
												{bird.name}
											</Card.Title>
											{collection &&
												<Card.Text className="ms-3 ms-md-0">
													<span>
														{`One of ${collection.count} in the `}
													</span>
													<Link
														className="text-success"
														to={`/collection?number=${bird.collection}`}>
														{collection.name}
													</Link>
													<span>
														{" flock."}
													</span>
												</Card.Text>
											}
											<ListGroup
												className="mb-3"
												variant="flush">
												<ListGroup.Item className="list-group-item-owner">
													<span className="w-50 fw-bold">
														{"Owner"}
													</span>
													{bird.owner
														?
															<AccountOwner
																className="w-50 justify-center"
																account={bird.owner} />
														:
															<span className="w-50 text-center">{"None"}</span>
													}
												</ListGroup.Item>
												<ListGroup.Item className="list-group-item-species">
													<span className="w-50 fw-bold">
														{"Species"}
													</span>
													<span className="w-50 text-center">
														{bird.species || "ERROR"}
													</span>
												</ListGroup.Item>
												<ListGroup.Item className="list-group-item-song-audio">
													<span className="w-50 fw-bold">
														{"Song Audio"}
													</span>
													<BirdAudioFile
														className="w-50 text-center"
														birdId={bird.id} />
												</ListGroup.Item>
											</ListGroup>
											{!bird.owner &&
												<div className="d-grid gap-2">
													<Button
														disabled={isIdentifyingBird || txMintBirdNonSmartWallet?.pending}
														size="lg"
														variant="info"
														onClick={() => setIsIdentifyingBird(true)}>
														{"Identify"}
													</Button>
												</div>
											}
										</Card.Body>
									</Row>
								</Card>
							</Col>
						</Row>
						{/*
							<Row>
								<Col>
									<Card>
										<h2 className="m-3">{"History"}</h2>
										<ListGroup>
											<ListGroup.Item>
												{`Correctly identified as ${bird.species} by ${bird.owner} on ${new Date()}!`}
											</ListGroup.Item>
											<ListGroup.Item>
												{`Incorrectly identified as Mallard by ${bird.owner} on ${new Date()}...`}
											</ListGroup.Item>
											<ListGroup.Item>
												{`Incorrectly identified as Northern Cardinal by ${bird.owner} on ${new Date()}...`}
											</ListGroup.Item>
										</ListGroup>
									</Card>
								</Col>
							</Row>
						*/}
					</>
				}
				{isIdentifyingBird && bird &&
					<BirdIdentificationModal
						isOpen={isIdentifyingBird}
						bird={bird}
						context={context}
						onSubmitNonSmartWallet={handleMintBirdNonSmartWallet}
						onSuccess={onMintSuccess}
						onToggle={() => setIsIdentifyingBird(false)} />
				}
			</Container>
		</div>
	);

};

export default BirdDetails;
