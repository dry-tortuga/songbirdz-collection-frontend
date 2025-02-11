import React, { useCallback, useState, forwardRef } from "react";
import { useLocation } from "react-router-dom";
import {
	Col,
	Container,
	Form,
	Row,
} from "react-bootstrap";
import { VirtuosoGrid } from "react-virtuoso";

import { COLLECTIONS } from "../constants";

import { useIdentificationContext } from "../contexts/identification";

import useAlreadyIdentifiedList from "../hooks/useAlreadyIdentifiedList";
import useBirdsV2 from "../hooks/useBirdsV2";

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

	const { setIsIdentifyingBird, setBirdToID } = useIdentificationContext();

	const { search } = useLocation();

	const queryParams = new URLSearchParams(search);

	// Check if filtering the birds to a single collection
	const filteredCollectionId =
		isNaN(parseInt(queryParams.get("number"), 10)) ? -1 : parseInt(queryParams.get("number"), 10);

	// Check if filtering the list to remove "already identified" birds
	const hideAlreadyIdentifiedParam = queryParams.get("hide_already_identified") === "true";

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
		onChangeFilter,
	} = useBirdsV2({
		collectionId: filteredCollectionId,
		showOnlyUnidentifiedBirds,
		alreadyIdentifiedList,
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
									<option
									   key={collection.name}
									   value={index}>
									   {collection.name}
									</option>
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

                                            setIsIdentifyingBird(true);
                                            setBirdToID(bird);

                                        }}
                                        onPlaySong={handlePlaySong} />
    							)} />
						 }
					</Col>
				</Row>
			</Container>
		</div>
	);

};

export default BirdGallery;
