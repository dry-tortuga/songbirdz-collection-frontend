import React, { useCallback, useEffect, useState, forwardRef } from "react";
import { useLocation } from "react-router-dom";
import {
	Col,
	Container,
	Form,
	Row,
	ToastContainer,
} from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";
import BirdIdentificationTransactionStatusNonSmartWallet from "../components/BirdIdentificationTransactionStatusNonSmartWallet";
import DailyStreakStatus from "../components/DailyStreakStatus";
import WalletConnectionStatus from "../components/WalletConnectionStatus";

import { COLLECTIONS } from "../constants";
import { useWalletContext } from "../contexts/wallet";

import useAlreadyIdentifiedList from "../hooks/useAlreadyIdentifiedList";
import useBirdsV2 from "../hooks/useBirdsV2";
import useMintAPI from "../hooks/useMintAPI";

import './BirdGallery.css';

// Ensure that this stays out of the component,
// Otherwise the grid will remount with each render due to new component instances.
const gridComponents = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }) => (
    <div
      {...props}
      style={{
        padding: '0.5rem',
        display: "flex",
        flex: "none",
        alignContent: "stretch",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  )
}

const GridBirdCard = (props) => {

    const { bird, activeAudio, onClick, onPlaySong, ...restProps } = props;

    return (
        <div
            className="grid-bird-card"
            {...restProps}
            title={`View ${bird.name}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
            onClick={() => onClick(bird)}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '80%',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    backgroundImage: `url(${bird.image})`,
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
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                {bird.name}
            </div>
            <button
                className="icon-btn"
                title={`Listen to ${bird.name}'s song`}
                style={{
                    position: 'absolute',
                    right: '0.5rem',
                    bottom: 'calc(0.5rem + 20%)',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#000000b0',
                    borderRadius: 8,
                }}
                onClick={(event) => onPlaySong(event, bird)}>
                <i
                    className={`fa-solid fa-music ${activeAudio?.id === bird.id ? 'fa-beat' : ''}`}
                    style={{
                        color: "#ffffff",
                        verticalAlign: 'text-bottom',
                    }} />
            </button>
        </div>
    );

};

const BirdGallery = () => {

	const context = useWalletContext();

	const { currentUser, setCurrentUser } = context;

	const { search } = useLocation();

	const queryParams = new URLSearchParams(search);

	// Check if filtering the birds to a single collection
	const filteredCollectionId =
		isNaN(parseInt(queryParams.get("number"), 10)) ? -1 : parseInt(queryParams.get("number"), 10);

	// Check if filtering the list to remove "already identified" birds
	const hideAlreadyIdentifiedParam = queryParams.get("hide_already_identified") === "true";

	// Keep track of the bird to identify
	const [birdToID, setBirdToID] = useState(null);

	// Keep track of the wallet connection state
    const [showWalletConnectionInfo, setShowWalletConnectionInfo] =
        useState(false);

    // Keep track of the active bird song to play
    const [activeAudio, setActiveAudio] = useState({ id: -1,  audioPlayer: null });

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
		identifiedCurrentSession,
		onChangeFilter,
		onChangeIdentified,
	} = useBirdsV2({
		context,
		collectionId: filteredCollectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
	});

	const {
        // Callback functions to submit the tx onchain
        handleMintSmartWallet,
        handleMintNonSmartWallet,

        // Keep track of the tx state
        txMintSmartWallet,
        txMintNonSmartWallet,

        // Reset the tx state
        resetTxMintSmartWallet,
        resetTxMintNonSmartWallet,
    } = useMintAPI({
        context,
        // Handle updates to the local state after successful mint
        cb: (updatedBirdData, updatedTracker) => {

            if (updatedBirdData) {
                onChangeIdentified(updatedBirdData.id);
            }

            if (updatedTracker) {
                setCurrentUser((prev) => ({
                    ...prev,
                    dailyStreakTracker: updatedTracker,
                }));
            }
        },

    });

	const handlePlaySong = useCallback((event, bird) => {

        event.preventDefault();
        event.stopPropagation();

        if (activeAudio?.audioPlayer) {

            activeAudio.audioPlayer.pause();

            if (bird.id === activeAudio.id) {

                setActiveAudio({ id: -1, audioPlayer: null });
                return;

            }

        }

        const audioPlayer = new Audio(bird.audio);

        console.log(bird.audio);
        console.log(audioPlayer);

        audioPlayer.loop = true;
        audioPlayer.play();

        setActiveAudio({ id: bird.id, audioPlayer });

    }, [activeAudio]);

	const handleStopSong = useCallback(() => {

        if (activeAudio?.audioPlayer) {

            activeAudio.audioPlayer.pause();

            setActiveAudio({ id: -1, audioPlayer: null });

        }

    }, [activeAudio]);

	// Get the collection data
	const collection = COLLECTIONS[filters.collectionId];

	// Re-load the twitter share button if the identified bird changes
    useEffect(() => {

        if (identifiedCurrentSession && window.twttr?.widgets) {
            window.twttr.widgets.load(document.getElementById("gallery-page"));
        }

    }, [identifiedCurrentSession]);

	console.debug("-------------- BirdGallery -----------");
	console.debug(birds);
	console.debug(collection);
	console.debug(context);
	console.debug("--------------------------------------")

	return (
		<div
            id="gallery-page"
            className="gallery-page">
			<Container className="mt-4">
				<Row className="mb-3">
					<Col>
						<h1 className="d-flex align-items-center">
							<span className="me-auto">
								{"Collection"}
							</span>
						</h1>
						<div className="flex flex-col flex-lg-row align-items-lg-center">
							<Form.Select
								id="selected-flock-to-view"
								className="mb-2 mb-lg-0 w-auto"
								aria-label="Choose a specific flock to view"
								value={filters.collectionId < 0 ? "-1" : filters.collectionId.toString()}
                                onChange={(event) => {

                                    handleStopSong();
                                    onChangeFilter("collectionId", parseInt(event.target.value, 10));

                                }}>
								<option value={"-1"}>{"Choose a flock"}</option>
								{COLLECTIONS.map((collection, index) => (
									<option value={index}>{collection.name}</option>
								))}
							</Form.Select>
							<Form className="ms-lg-3 mb-2 mb-lg-0 ">
								<Form.Check
									type="switch"
									id="show-only-unidentified-birds"
									label="Show Unidentified"
									checked={showOnlyUnidentifiedBirds}
                                    onChange={(event) => {

                                        handleStopSong();
                                        setShowOnlyUnidentifiedBirds(event.target.checked);

                                    }} />
							</Form>
						</div>
					</Col>
				</Row>
				<Row className="mb-3">
					<Col>
						{!birds &&
							<i className="fa-solid fa-spinner fa-spin fa-xl me-2" />
						}
						{birds?.length === 0 &&
						  <span>
							{`All birdz in the ${collection.name} flock have been successfully identified... early bird gets the worm :)`}
						</span>
						}
						{birds &&
    						<VirtuosoGrid
                                totalCount={birds.length}
                                components={gridComponents}
                                style={{
                                    //height: '80vh',
                                    width: '100%',
                                    marginLeft: '-0.5rem',
                                    marginRight: '-0.5rem',
                                }}
                                useWindowScroll
    							itemContent={(index) => (
    							    <GridBirdCard
                                        bird={birds[index]}
                                        activeAudio={activeAudio}
                                        onClick={(bird) => {

                                            handleStopSong();
                                            setBirdToID(bird);

                                        }}
                                        onPlaySong={handlePlaySong} />
    							)} />
						 }
					</Col>
				</Row>
			</Container>
			{birdToID && (
                <BirdIdentificationModal
                    id={birdToID?.id}
                    cached={Boolean(birdToID?.cached)}
                    isOpen={Boolean(birdToID)}
                    context={context}
                    onSubmitNonSmartWallet={handleMintNonSmartWallet}
                    onSubmitSmartWallet={handleMintSmartWallet}
                    onToggle={() => setBirdToID(null)} />
            )}
            <ToastContainer
                className="p-3"
                style={{ zIndex: 5 }}
                position="top-end">
                {showWalletConnectionInfo && (
                    <WalletConnectionStatus
                        onClose={() => setShowWalletConnectionInfo(false)}
                    />
                )}
                {/* Smart Wallet Users */}
                {(txMintSmartWallet?.pending ||
                    txMintSmartWallet?.success ||
                    txMintSmartWallet?.error) && (
                        <BirdIdentificationTransactionStatus
                            tx={txMintSmartWallet}
                            onClose={resetTxMintSmartWallet}
                        />
                    )}
                {/* Non-Smart Wallet Users */}
                {(txMintNonSmartWallet?.pending ||
                    txMintNonSmartWallet?.success ||
                    txMintNonSmartWallet?.error) && (
                        <BirdIdentificationTransactionStatusNonSmartWallet
                            tx={txMintNonSmartWallet}
                            onClose={resetTxMintNonSmartWallet}
                        />
                    )}
                {(currentUser?.dailyStreakTracker?.status === "created" ||
                    currentUser?.dailyStreakTracker?.status ===
                    "updated") && (
                        <DailyStreakStatus
                            data={currentUser?.dailyStreakTracker}
                        />
                    )}
            </ToastContainer>
		</div>
	);

};

export default BirdGallery;
