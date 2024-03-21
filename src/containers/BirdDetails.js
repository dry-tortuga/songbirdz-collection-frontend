import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Button,
	Card,
	Col,
	Container,
	ListGroup,
	Row,
} from "react-bootstrap";

import { useWalletContext } from "../contexts/wallet";

import BirdAudioFile from "../components/BirdAudioFile";
import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";

import { COLLECTIONS } from "../constants";

import useCurrentUser from "../hooks/useCurrentUser";
import useBird from "../hooks/useBird";
import useMintAPI from "../hooks/useMintAPI";

import coinbaseLogo from "../images/coinbase-logomark-blue.svg";
import openseaLogo from "../images/opensea-logomark-blue.svg";

import { populateMetadata } from "../utils/data";

import "./BirdDetails.css";

const BirdDetails = () => {

	const context = useWalletContext();

	const params = useParams();

	// Get the current user details
	const [currentUser] = useCurrentUser({ context });

	// Get the bird details
	const [bird, setBird] = useBird({
		context,
		id: parseInt(params.id, 10),
	});

	// True, if the modal is open
	const [isIdentifyingBird, setIsIdentifyingBird] = useState(false);

	const onMintSuccess = async (idEvent, transferEvent) => {

		// Check if the user successfully identified the bird, i.e. is now the owner
		if (transferEvent) {

			const updatedData = { ...bird, owner: currentUser.account }; 

			const finalData = await populateMetadata(updatedData);

			setBird(finalData);

		}

	};

	const [handleMintBird, txMintBird, resetTxMintBird] = useMintAPI({
		context,
		cb: onMintSuccess,
	});

	const collection = bird ? COLLECTIONS[bird.collection] : null;

	console.debug("-------------- BirdDetails -----------");
	console.debug(bird);
	console.debug("--------------------------------------")

	return (
		<div className="details-page">
			<Container className="my-4">
				{!bird &&
					<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
				}
				{!currentUser &&
					<span>{"Connect your wallet to get started..."}</span>
				}
				{currentUser && bird &&
					<>
						<Row className="mb-3">
							<Col className="d-flex align-items-center">
								<h1 className="d-flex align-items-center me-auto">
									{bird.name}
								</h1>
								{bird.owner
									? (
										<>
											<a
												className="btn btn-clear"
												href={`https://opensea.io/assets/base/${context.songBirdzContract.address}/${bird.id}`}
												rel="noopener noreferrer nofollow"
												target="_blank">
												<img
													alt=""
													src={openseaLogo}
													style={{ width: '35px', height: 'auto' }} />
											</a>
											<a
												className="btn btn-clear"
												href={`https://nft.coinbase.com/nft/base/${context.songBirdzContract.address}/${bird.id}`}
												rel="noopener noreferrer nofollow"
												target="_blank">
												<img
													alt=""
													src={coinbaseLogo}
													style={{ width: '35px', height: 'auto' }} />
											</a>
										</>
									) : (
										<Button
											disabled={txMintBird.transaction}
											variant="success"
											onClick={() => setIsIdentifyingBird(true)}>
											{"Identify"}
										</Button>
									)
								}
							</Col>
						</Row>
						{(txMintBird.transaction || txMintBird.error) &&
							<Row className="mb-3">
								<Col>
									<BirdIdentificationTransactionStatus
										tx={txMintBird}
										onClose={resetTxMintBird} />
								</Col>
							</Row>
						}
						<Row>
							<Col>
								<Card>
									<Row>
										<img
											key={bird.image}
											alt=""
											className="col-12 col-sm-6 col-md-4"
											src={bird.image} />
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
														{" Collection."}
													</span>
												</Card.Text>
											}
											<ListGroup
												className="mt-auto"
												variant="flush">
												<ListGroup.Item className="list-group-item-owner">
													<span className="w-50 fw-bold">
														{"Owner"}
													</span>
													<span className="w-50 text-center">
														{bird.owner || "None"}
													</span>
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
						onSubmit={handleMintBird}
						onToggle={() => setIsIdentifyingBird(false)} />
				}
			</Container>
		</div>
	);

};

export default BirdDetails;
