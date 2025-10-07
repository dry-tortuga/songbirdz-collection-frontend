import React, { useCallback, useState } from 'react';
import { Button, Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useFarcasterContext } from "../contexts/farcaster";

import useBirdOfTheWeek from '../hooks/useBirdOfTheWeek';

import baseLogo from "../images/base-logo-blue.svg";
import farcasterLogo from "../images/farcaster-logo.png";

const BirdOfTheWeek = () => {

	const navigate = useNavigate();

	const {
		isBaseApp,
		isFarcasterApp,
		fComposeCast,
		fOpenExternalURL,
		fPopulateUsers,
	} = useFarcasterContext();

	const { data, loading, error } = useBirdOfTheWeek();

	// Keep track of the active bird song to play
	const [activeAudio, setActiveAudio] = useState({ id: -1,  audioPlayer: null });

	const handlePlaySong = useCallback((event, birdId) => {

		event.preventDefault();
		event.stopPropagation();

		if (activeAudio?.audioPlayer) {

			activeAudio.audioPlayer.pause();

			if (birdId === activeAudio?.id) {

				setActiveAudio({ id: -1, audioPlayer: null });
				return;

			}

		}

		const audioPlayer = new Audio(`${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/audio/${birdId}.mp3`,);

		audioPlayer.loop = true;
		audioPlayer.play();

		setActiveAudio({ id: birdId, audioPlayer });

	}, [activeAudio]);

	if (loading) {
		return (
			<Container className="text-center py-5">
				<h2>
					<i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
					Loading Bird of the Week...
				</h2>
			</Container>
		);
	}

	if (error || !data) {
		return (
			<Container className="text-center py-5">
				<h2>Error loading bird data</h2>
				<p>{error || 'No data available'}</p>
			</Container>
		);
	}

	console.log(data);

	return (
		<div className="bird-of-the-week-page">
			<Container className="mt-4">
				<Row>
					<Col>
						<h1 className="text-center mb-4">
							Bird of the Week - {new Date().toLocaleDateString()}
						</h1>
						<h2 className="text-center text-primary mb-4">
							{data.species}
						</h2>
					</Col>
				</Row>
				<Row>
					<Col lg={8} className="mx-auto">
						<Row>
							{data.ids?.map((birdId, index) => (
								<Col
									md={4}
									key={index}
									className="mb-3"
									style={{ cursor: 'pointer' }}
									onClick={() => {
										navigate(`/collection/${birdId}`);
									}}>
									<div
										className="grid-bird-card"
										title={`View Songbird #${birdId}`}
										style={{
											position: 'relative',
											width: '100%',
											height: '280px',
										}}>
										<div
											style={{
												position: 'relative',
												width: '100%',
												height: '230px',
												borderTopLeftRadius: 8,
												borderTopRightRadius: 8,
												backgroundImage: `url(${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/images/${birdId}-lg.jpg)`,
												backgroundPosition: 'center',
												backgroundSize: 'contain',
											}} />
										<div
											style={{
												textAlign: 'center',
												padding: '0.5rem 0.25rem',
												background: '#dee2e612',
												borderBottomRightRadius: 8,
												borderBottomLeftRadius: 8,
												boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
												height: '40px',
											}}>
											{`Songbird #${birdId}`}
										</div>
										<button
											className="icon-btn"
											title="Listen to the bird's song"
											style={{
												position: 'absolute',
												right: '0.5rem',
												bottom: 'calc(0.5rem + 20%)',
												padding: '0.25rem 0.5rem',
												backgroundColor: '#000000b0',
												borderRadius: 8,
											}}
											onClick={(event) => handlePlaySong(event, birdId)}>
											<i
												className={`fa-solid fa-music ${activeAudio?.id === birdId ? 'fa-beat' : ''}`}
												style={{
													color: "#ffffff",
													verticalAlign: 'text-bottom',
												}} />
										</button>
									</div>
								</Col>
							))}
						</Row>
					</Col>
				</Row>

				<Row className="mb-4">
					<Col lg={8} className="mx-auto">
						<Card>
							<Card.Header>
								<h3>Fun Facts</h3>
							</Card.Header>
							<Card.Body>
								{data.facts?.map((fact, index) => (
									<p key={index} className="mb-2">• {fact}</p>
								))}
								{(isBaseApp || isFarcasterApp) && (
									<Button
										className="w-100 mt-3 py-2"
										as="a"
										href={`https://farcaster.xyz/~/compose?text=${encodeURIComponent(`Check out the latest "Bird of the Week" from Songbirdz!\n\n${data.species}\n\nhttps://songbirdz.cc/bird-of-the-week\n\n`)}&channelKey=songbirdz&embeds[]=${encodeURIComponent(`https://songbirdz.cc/bird-of-the-week`)}`}
										target="_blank"
										rel="noopener noreferrer"
										variant="outline-primary"
										onClick={(event) => fComposeCast(event, {
											text: `Check out the latest "Bird of the Week" from Songbirdz!\n\n${data.species}\n\nhttps://songbirdz.cc/bird-of-the-week\n\n`,
											embeds: [
												`https://songbirdz.cc/bird-of-the-week`,
												`${process.env.REACT_APP_SONGBIRDZ_STATIC_URL}/images/${data.ids[0]}-lg.jpg`,
											],
											channelKey: 'songbirdz',
										})}>
										<div className="d-flex align-items-center justify-content-center">
											{isBaseApp &&
												<>
													<img
														className="me-2"
														src={baseLogo}
														alt=""
														style={{ width: "20px", height: "20px" }} />
													<span>
														{'Share on Base App'}
													</span>
												</>
											}
											{isFarcasterApp &&
												<>
													<img
														className="farcaster-logo me-2"
														src={farcasterLogo}
														alt=""
														style={{ width: "20px", height: "20px" }} />
													<span>
														{"Share on Farcaster"}
													</span>
												</>
											}
										</div>
									</Button>
								)}
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Row className="mb-4">
					<Col
						lg={8}
						className="mx-auto">
						<iframe src="https://macaulaylibrary.org/asset/643099636/embed" height="530" width="800" frameborder="0" allowfullscreen></iframe>
					</Col>
				</Row>
				<Row className="mb-4">
					<Col lg={8} className="mx-auto">
						<Card>
							<Card.Header>
								<h4>Learn More</h4>
							</Card.Header>
							<Card.Body>
								{data.links?.map((link, index) => (
									<p key={index} className="mb-2">
										• <a
											href={link}
											target="_blank"
											rel="noopener noreferrer">
											{link}
										</a>
									</p>
								))}
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default BirdOfTheWeek;