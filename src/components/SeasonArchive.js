import React from "react";
import PropTypes from "prop-types";
import { Alert, Form } from "react-bootstrap";

import { ARCHIVE_SEASONS } from "../constants/seasons";

import { useWalletContext } from "../contexts/wallet";

import usePointsLeaderboard from "../hooks/usePointsLeaderboard";

import LeaderboardTable from "./LeaderboardTable";

// Season 8 only: reads the live database until its final top 50 is exported to JSON.
const LiveSeasonTable = ({ season }) => {

	const { account } = useWalletContext();

	const { data } = usePointsLeaderboard({ account, season });

	if (!data) {
		return <i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading" />;
	}

	return <LeaderboardTable users={data} />;

};

LiveSeasonTable.propTypes = { season: PropTypes.number.isRequired };

const SeasonArchive = ({ seasonId, onChange }) => {

	const season = ARCHIVE_SEASONS.find((item) => item.id === seasonId)
		|| ARCHIVE_SEASONS[ARCHIVE_SEASONS.length - 1];

	return (
		<section aria-labelledby="season-archive-heading">
			<h2 id="season-archive-heading">{"Season Archive"}</h2>
			<Form.Select
				className="mb-3 w-auto"
				aria-label="Choose a season"
				value={season.id}
				onChange={(event) => onChange(parseInt(event.target.value, 10))}>
				{ARCHIVE_SEASONS.map((item) => (
					<option key={item.id} value={item.id}>
						{`Season ${item.id}: ${item.title}`}
					</option>
				))}
			</Form.Select>
			<Alert variant="warning">
				<strong>{`Archive: Season ${season.id} has ended.`}</strong>
				{" Results are final and read-only."}
			</Alert>
			{season.data
				? <LeaderboardTable key={season.id} users={season.data} />
				: <LiveSeasonTable key={season.id} season={season.id} />
			}
			<h3 className="h4 mt-4">{`${season.title} (Season ${season.id})`}</h3>
			<p>{`Ran from ${season.dates}.`}</p>
			<p className="mb-1">{"Accounts with the most Birder Points received:"}</p>
			<ul style={{ listStyle: "disc" }}>
				{season.prizes.map((prize) => <li key={prize}>{prize}</li>)}
			</ul>
		</section>
	);

};

SeasonArchive.propTypes = {
	seasonId: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default SeasonArchive;
