import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
	Alert,
	Badge,
	Button,
	Col,
	Container,
	Row,
} from "react-bootstrap";

import { COLLECTIONS } from "../constants";
import { useWalletContext } from "../contexts/wallet";

import BirdsTable from "../components/BirdsTable";
import ConnectWalletButton from "../components/ConnectWalletButton";

import useAlreadyIdentifiedList from "../hooks/useAlreadyIdentifiedList";
import useBirds from "../hooks/useBirds";

const BirdListing = () => {

	const context = useWalletContext();

	const { search } = useLocation();

	const queryParams = new URLSearchParams(search);

	// Check if filtering the birds to a single collection
	const filteredCollectionId =
		isNaN(parseInt(queryParams.get("number"), 10)) ? -1 : parseInt(queryParams.get("number"), 10);

	// Check if filtering the list to remove "already identified" birds
	const hideAlreadyIdentifiedParam = queryParams.get("hide_already_identified") === "true";

	// Get the list of "already identified" birds in the available collection
	const {
		showOnlyUnidentifiedBirds,
		setShowOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	} = useAlreadyIdentifiedList({ hideAlreadyIdentifiedParam });

	// Get the list of birds
	const {
		data: birds,
		filters,
		pagination,
		onChangeFilter,
		onChangePage,
	} = useBirds({
		context,
		collectionId: filteredCollectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	});

	// Keep track of the state of the info alert
	const [showInfoAlert, setShowInfoAlert] = useState(true);

	// Get the collection data
	const collection = COLLECTIONS[filters.collectionId];

	console.debug("-------------- BirdListing -----------");
	console.debug(birds);
	console.debug(collection);
	console.debug(context);
	console.debug("--------------------------------------")

	return (
		<div className="listing-page">
			<Container className="mt-4">
				{context.account &&
					<Row className="mb-3">
						<Col>
							<h1 className="d-flex align-items-center">
								<span className="me-auto">
									{"Songbirdz"}
									{collection &&
										<Badge
											className="fs-6 ms-3 align-middle"
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
				}
				<Row className="mb-3">
					<Col>
						{!context.account &&
							<>
								<div className="text-center">
									{"Connect your wallet to get started..."}
								</div>
								<ConnectWalletButton className="flex d-md-none justify-center mt-3" />
							</>
						}
						{context.account && !context.isOnCorrectChain &&
							<span className="me-1">
								{"Double check to make sure you're on the Base network..."}
							</span>
						}
						{context.account &&
							context.isOnCorrectChain &&
							!birds &&
							<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
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
						(*/}
						{birds &&
							<BirdsTable
								birds={birds}
								filters={filters}
								pagination={pagination}
								showOnlyUnidentifiedBirds={showOnlyUnidentifiedBirds}
								setShowOnlyUnidentifiedBirds={setShowOnlyUnidentifiedBirds}
								onChangeFilter={onChangeFilter}
								onChangePage={onChangePage} />
						}
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default BirdListing;
