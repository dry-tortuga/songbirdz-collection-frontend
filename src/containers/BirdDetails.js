import React, { useState } from "react";
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

import BirdAudioFile from "../components/BirdAudioFile";
import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";

import { COLLECTIONS } from "../constants";

import useCurrentUser from "../hooks/useCurrentUser";
import useBird from "../hooks/useBird";
import useMintAPI from "../hooks/useMintAPI";

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
								<h1 className="d-flex align-items-center">
									{bird.name}
								</h1>
								{bird.id > 0 &&
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
								{bird.id < 999 &&
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
								{bird.owner
									? (
										<a
											className="btn btn-clear ms-auto"
											href={`https://opensea.io/assets/base/${context.songBirdzContract.address}/${bird.id}`}
											rel="noopener noreferrer nofollow"
											target="_blank">
											<img
												alt=""
												src={openseaLogo}
												style={{ width: '35px', height: 'auto' }} />
										</a>
									) : (
										<Button
											className="ms-auto"
											disabled={txMintBird.transaction}
											variant="success"
											onClick={() => setIsIdentifyingBird(true)}>
											{"Identify"}
										</Button>
									)
								}
							</Col>
						</Row>
						<Row className="mb-3">
							<Col>
								<Alert variant="info">
									<b>{'1. '}</b>
									<span className="me-1">{'Find a bird that is UNIDENTIFIED.'}</span>
									<b>{'2. '}</b>
									<span className="me-1">{'Click on the bird\'s name to see the minting page.'}</span>
									<b>{'3. '}</b>
									<span className="me-1">{'View the image and listen to the audio recording of the bird\'s song.'}</span>
									<b>{'4. '}</b>
									<span className="me-1">{'Click on the "Identify" button and submit your guess for the correct species of the bird from a list of 5 answer choices.'}</span>
									<b>{'5. '}</b>
									<span>{'If you\'re correct, you\'ll be the new owner of the bird!'}</span>
								</Alert>
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
