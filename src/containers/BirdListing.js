import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
	Alert,
	Badge,
	Button,
	Col,
	Container,
	Row,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import { COLLECTIONS } from "../constants";

import CreateWalletButton from "../components/CreateWalletButton";
import BirdsTable from "../components/BirdsTable";

import useBirds from "../hooks/useBirds";

const BirdListing = () => {

	const context = useWalletContext();

	const { search } = useLocation();

	const [showOnlyUnidentifiedBirds, setShowOnlyUnidentifiedBirds] = useState(false);

	const queryParams = new URLSearchParams(search);

	// Check if filtering the birds to a single collection
	const collectionId =
		isNaN(parseInt(queryParams.get("number"), 10)) ? null : parseInt(queryParams.get("number"), 10);

	// Get the collection data
	const collection = COLLECTIONS[collectionId];

	// Get the list of birds
	const {
		data: birds,
		pagination,
		onChangePage,
	} = useBirds({ context, collection, showOnlyUnidentifiedBirds });

	// Keep track of the state of the info alert
	const [showInfoAlert, setShowInfoAlert] = useState(true);

	console.debug("-------------- BirdListing -----------");
	console.debug(birds);
	console.debug(collection);
	console.debug(context);
	console.debug("--------------------------------------")

	return (
		<div className="listing-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1 className="d-flex align-items-center">
							<span className="me-auto">
								{"Songbirdz"}
								{collection &&
									<Badge
										className="fs-6 ms-1 align-middle"
										bg="success"
										pill>
										<span>
											{collection.name}
											{" - "}
											{collection.count}
										</span>
									</Badge>
								}
							</span>
						</h1>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						{context.account &&
							context.isOnCorrectChain &&
							!birds &&
							<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
						}
						{!context.account &&
							<span className="me-1">
								{"Connect your wallet to get started..."}
							</span>
						}
						{context.account && !context.isOnCorrectChain &&
							<span className="me-1">
								{"Double check to make sure you're on the Base network..."}
							</span>
						}
						{!context.account &&
							<div className="d-grid d-md-none gap-3 mt-3">
								<CreateWalletButton />
								<Button
									variant="primary"
									onClick={() => context.onConnectWallet()}>
									{"Connect Wallet"}
								</Button>
							</div>
						}
						{birds && showInfoAlert &&
							<Alert
								variant="info"
								dismissible
								onClose={() => setShowInfoAlert(false)}>
								<p className="mb-1"><b>{'1. '}</b>{'Find a bird that is UNIDENTIFIED.'}</p>
								<p className="mb-1"><b>{'2. '}</b>{'Click on the bird\'s name to see its details page.'}</p>
								<p className="mb-1"><b>{'3. '}</b>{'View the image and listen to the audio recording of the bird\'s song.'}</p>
								<p className="mb-1"><b>{'4. '}</b>{'Click on the "Identify" button and submit your guess for the correct species of the bird from a list of 5 answer choices.'}</p>
								<p className="mb-0"><b>{'5. '}</b>{'If you\'re correct, you\'ll be the new owner of the bird!'}</p>
							</Alert>
						}
						{/*
							<Alert variant="success">
								<p className="mb-1"><b>{'The 1st flock of birds is now 100% identified... but stay tuned for details about the release of the next flock of 1,000 birds!'}</b></p>
								<p className="mb-1">
									<span className="me-1">
										{"Follow on"}
									</span><a
									href="https://twitter.com/dry_tortuga"
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
						{birds &&
							<BirdsTable
								birds={birds}
								pagination={pagination}
								showOnlyUnidentifiedBirds={showOnlyUnidentifiedBirds}
								setShowOnlyUnidentifiedBirds={setShowOnlyUnidentifiedBirds}
								onChangePage={onChangePage} />
						}
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default BirdListing;
