import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
	Badge,
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
							<span>
								{"Connect your wallet to get started..."}
							</span>
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
