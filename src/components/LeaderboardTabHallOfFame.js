import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Col, Row } from "react-bootstrap";

import SeasonArchive from "./SeasonArchive";

const HALL_OF_FAME_URL = "https://opensea.io/collection/songbirdz-hall-of-fame";

const LeaderboardTabHallOfFame = ({ seasonId, onSeasonChange }) => (
	<>
		<Row className="mb-4">
			<Col>
				<Card>
					<Card.Body>
						<Card.Title as="h2">{"Trophies"}</Card.Title>
						<Card.Text>
							{"The top 3 birders of each season earned a pixel-art trophy in the Songbirdz Hall of Fame collection."}
						</Card.Text>
						<Button
							as="a"
							variant="outline-primary"
							href={HALL_OF_FAME_URL}
							target="_blank"
							rel="noopener noreferrer nofollow">
							{"View trophies on OpenSea"}
						</Button>
					</Card.Body>
				</Card>
			</Col>
		</Row>
		<Row>
			<Col>
				<SeasonArchive seasonId={seasonId} onChange={onSeasonChange} />
			</Col>
		</Row>
	</>
);

LeaderboardTabHallOfFame.propTypes = {
	seasonId: PropTypes.number.isRequired,
	onSeasonChange: PropTypes.func.isRequired,
};

export default LeaderboardTabHallOfFame;
