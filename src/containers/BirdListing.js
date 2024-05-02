import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
	Alert,
	Badge,
	Button,
	Col,
	Container,
	Row,
	Tab,
	Tabs,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import { COLLECTIONS } from "../constants";

import BirdsTable from "../components/BirdsTable";

import useBirds from "../hooks/useBirds";

import "./BirdListing.css";

const TAB_AVAILABLE = "available";

const BirdListing = () => {

	const context = useWalletContext();

	const { search } = useLocation();

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
	} = useBirds({ context, collection });

	// Keep track of the current tab
	const [tab, setTab] = useState(TAB_AVAILABLE);

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
				<Row>
					<Col>
						{!birds &&
							<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
						}
						{!context.account &&
							<span className="me-1">
								{"Connect your wallet to get started..."}
							</span>
						}
						{!context.isOnCorrectChain &&
							<span className="me-1">
								{"Double check to make sure you're on the Base network..."}
							</span>
						}
						{!context.account &&
							<div className="d-flex align-items-center justify-content-center">
								<Button
									variant="info"
									onClick={() => context.onConnectWallet()}>
									{"Connect Wallet"}
								</Button>
							</div>
						}
						{birds &&
							<Alert variant="info">
								<p className="mb-1"><b>{'1. '}</b>{'Find a bird that is UNIDENTIFIED.'}</p>
								<p className="mb-1"><b>{'2. '}</b>{'Click on the bird\'s name to see the minting page.'}</p>
								<p className="mb-1"><b>{'3. '}</b>{'View the image and listen to the audio recording of the bird\'s song.'}</p>
								<p className="mb-1"><b>{'4. '}</b>{'Click on the "Identify" button and submit your guess for the correct species of the bird from a list of 5 answer choices.'}</p>
								<p className="mb-0"><b>{'5. '}</b>{'If you\'re correct, you\'ll be the new owner of the bird!'}</p>
							</Alert>
						}
						{birds &&
							<Tabs
								id="listing-page-tabs"
								activeKey={tab}
								onSelect={(newValue) => setTab(newValue)}
								className="pb-3">
								<Tab
									eventKey={TAB_AVAILABLE}
									title="Collections">
									<BirdsTable
										birds={birds}
										pagination={pagination}
										onChangePage={onChangePage} />
								</Tab>
							</Tabs>
						}
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default BirdListing;
