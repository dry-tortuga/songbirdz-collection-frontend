import React, { useMemo, useState } from "react";
import { Alert, Card, Container, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";
import { useEnsAddress, useEnsName } from "wagmi";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import { AccountAvatar } from "../components/AccountOwner";
import BadgeGrid from "../components/BadgeGrid";
import FlockProgress from "../components/FlockProgress";

import { NUM_SPECIES_TOTAL } from "../constants";
import { ARCHIVE_SEASONS } from "../constants/seasons";

import { useWalletContext } from "../contexts/wallet";

import useDailyStreak from "../hooks/useDailyStreak";
import useLifeList from "../hooks/useLifeList";
import useSpeciesSupply from "../hooks/useSpeciesSupply";

import { ENS_UNIVERSAL_RESOLVER, isEvmAddress, shortAddress } from "../utils/ens";
import { birdImage } from "../utils/data";
import {
	ALL_SPECIES,
	SPECIES_STATE,
	STATE_LABELS,
	flockNameForSpecies,
} from "../utils/lifeList";

import "./Profile.css";

const FILTER_ALL = "all";
const FILTER_RECORDED = "recorded";
const FILTER_MISSING = "missing";
const FILTER_1OF1 = "1of1";

const GROUP_ORDER = ["flock", "family", "none"];
const GROUP_LABELS = {
	flock: "Flock",
	family: "Family",
	none: "None",
};

// Flat, sorted list of all species (ids >= 1000 are season bonus tasks, not species)
const SPECIES_LABELS = Object.fromEntries(
	ALL_SPECIES.map((species) => [species.id, species.label]),
);

const StatCard = ({ label, children }) => (
	<div className="profile-stat">
		<div className="profile-stat__label">{label}</div>
		<div className="profile-stat__value">{children}</div>
	</div>
);

StatCard.propTypes = {
	label: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

const RareTile = ({ birdId, label }) => (
	<button
		type="button"
		className="rare-tile"
		title={label}
		aria-label={label}>
		<img src={birdImage(birdId)} alt="" loading="lazy" />
	</button>
);

RareTile.propTypes = {
	birdId: PropTypes.number.isRequired,
	label: PropTypes.string.isRequired,
};

// Public profile for any address, Base name, or ENS name. `/profile` shows the connected wallet.
const Profile = () => {

	const { address: param } = useParams();

	const { account } = useWalletContext();

	const paramIsAddress = isEvmAddress(param);

	const { data: resolvedAddress, isLoading: isResolving } = useEnsAddress({
		name: param && !paramIsAddress ? param : undefined,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
	});

	let address = null;

	if (!param) {
		address = account || null;
	} else if (paramIsAddress) {
		address = param;
	} else {
		address = resolvedAddress || null;
	}

	address = address ? address.toLowerCase() : null;

	const isOwner = Boolean(address && account && address === account.toLowerCase());

	const { data: name } = useEnsName({
		address,
		chainId: base.id,
		universalResolverAddress: ENS_UNIVERSAL_RESOLVER,
		enabled: Boolean(address),
	});

	const { data, loading, error } = useLifeList({ address });
	const tracker = useDailyStreak({ address });
	const supplyById = useSpeciesSupply();

	const [filter, setFilter] = useState(FILTER_ALL);
	const [groupBy, setGroupBy] = useState("flock");
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);

	const visibleSpecies = useMemo(() => {

		if (!data) { return []; }

		const query = search.trim().toLowerCase();

		return ALL_SPECIES.filter((species) => {

			const state = data.states[species.id];

			if (filter === FILTER_RECORDED && state !== SPECIES_STATE.RECORDED) { return false; }
			if (filter === FILTER_MISSING && state === SPECIES_STATE.RECORDED) { return false; }
			if (filter === FILTER_1OF1 && supplyById?.[species.id] !== 1) { return false; }

			if (query &&
				!species.label.toLowerCase().includes(query) &&
				!species.family.toLowerCase().includes(query)) {
				return false;
			}

			return true;

		});

	}, [data, filter, search, supplyById]);

	// Species held / claimable (gated behind the Phase 2 Life List contract)
	const readyToRecord = useMemo(() => {
		if (!data) { return []; }
		return ALL_SPECIES.filter((species) =>
			data.states[species.id] === SPECIES_STATE.HELD ||
			data.states[species.id] === SPECIES_STATE.LEGACY);
	}, [data]);

	// The user's own birds for their rarest species (up to 3)
	const rareFinds = useMemo(() => {

		if (!data) { return []; }

		if (!supplyById) {
			// Without the supply map, fall back to the leaderboard's rarest bird
			return data.rarestBirdId !== null && data.rarestBirdId !== undefined
				? [{ birdId: data.rarestBirdId, supply: null }]
				: [];
		}

		return ALL_SPECIES
			.filter((species) => data.states[species.id] === SPECIES_STATE.RECORDED)
			.map((species) => ({
				id: species.id,
				label: species.label,
				birdId: data.birdIds?.[species.id] ?? null,
				supply: supplyById[species.id] ?? null,
			}))
			.filter((item) => item.birdId !== null)
			.sort((a, b) => (a.supply ?? Number.MAX_SAFE_INTEGER) - (b.supply ?? Number.MAX_SAFE_INTEGER))
			.slice(0, 3);

	}, [data, supplyById]);

	// Trophy placements in the archived Birder Points seasons (top 50)
	const hallOfFame = useMemo(() => {

		if (!address) { return []; }

		const rows = [];

		ARCHIVE_SEASONS.forEach((season) => {

			const place = (season.data || [])
				.findIndex((user) => user.address?.toLowerCase() === address);

			if (place >= 0) {
				rows.push({ seasonId: season.id, place: place + 1 });
			}

		});

		return rows;

	}, [address]);

	// ---- Not enough information to show a profile ----

	if (!param && !account) {
		return (
			<div className="profile-page">
				<Container className="mt-4">
					<h1>{"My Profile"}</h1>
					<p>{"Connect your wallet to see your Life List."}</p>
					<ConnectButton />
				</Container>
			</div>
		);
	}

	if (param && !paramIsAddress && isResolving) {
		return (
			<div className="profile-page">
				<Container className="mt-4">
					<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading" />
				</Container>
			</div>
		);
	}

	if (!address) {
		return (
			<div className="profile-page">
				<Container className="mt-4">
					<h1>{"Profile not found"}</h1>
					<p>
						{`We couldn't find an account for "${param}". Check the address or name and try again, or `}
						<Link to="/leaderboard">{"browse the leaderboard"}</Link>
						{"."}
					</p>
				</Container>
			</div>
		);
	}

	const shareText = data
		? `I've recorded ${data.count} of ${NUM_SPECIES_TOTAL} species on my @songbirdz_cc Life List on @base!`
		: "Check out my Songbirdz Life List!";

	const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`https://songbirdz.cc/profile/${address}`)}`;

	const memberSince = data?.memberSince
		? dayjs(data.memberSince).format("MMMM D, YYYY")
		: null;

	const seasonKeys = data ? Object.keys(data.pointsBySeason).map(Number) : [];

	const latestSeason = seasonKeys.length > 0 ? Math.max(...seasonKeys) : 0;

	const seasonRows = data
		? ARCHIVE_SEASONS.filter((season) => data.pointsBySeason[season.id] > 0)
		: [];

	return (
		<div id="profile-page" className="profile-page">
			<Container className="mt-4">

				<div className="profile-header">
					<AccountAvatar
						address={address}
						name={name || undefined}
						rarestBirdId={rareFinds[0]?.birdId ?? data?.rarestBirdId}
						size={96} />
					<div className="profile-header__info">
						<h1 className="profile-name">{name || shortAddress(address)}</h1>
						<div className="profile-subtitle">
							{shortAddress(address)}
							{memberSince && ` · member since ${memberSince}`}
						</div>
						<div>
							<a
								href={`https://basescan.org/address/${address}`}
								target="_blank"
								rel="noopener noreferrer nofollow"
								className="profile-basescan-link">
								{"View on BaseScan"}
							</a>
						</div>
					</div>
					<a
						href={shareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="profile-share-btn">
						{"Share on X"}
					</a>
				</div>

				{loading &&
					<div className="my-3">
						<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading Life List" />
					</div>
				}
				{error &&
					<Alert variant="danger">
						{"We couldn't load this Life List. Refresh the page to try again."}
					</Alert>
				}

				{data &&
					<>

						{data.count >= NUM_SPECIES_TOTAL &&
							<Alert variant="success">
								{"Life List complete: all 800 species recorded."}
							</Alert>
						}

						<div className="profile-stats">
							<StatCard label="Species">
								{`${data.count} / ${NUM_SPECIES_TOTAL}`}
							</StatCard>
							<StatCard label="Rank">
								{typeof data.rank === "number" ? `#${data.rank}` : "Unranked"}
							</StatCard>
							<StatCard label="Daily streak">
								{tracker
									? `${tracker.login_streak} days (best ${tracker.longest_login_streak})`
									: "0 days (best 0)"}
							</StatCard>
							<StatCard label="Birder Points">
								{`Season ${latestSeason}: ${data.pointsBySeason[latestSeason] || 0}`}
							</StatCard>
						</div>

						<div className="profile-main-grid">

							<div>
								<h2>{"Life List"}</h2>

								<div className="profile-pill-row">
									{[
										[FILTER_ALL, "All"],
										[FILTER_RECORDED, "Collected"],
										[FILTER_MISSING, "Missing"],
										...(supplyById ? [[FILTER_1OF1, "1 of 1"]] : []),
									].map(([key, label]) => (
										<button
											key={key}
											type="button"
											className={`profile-pill${filter === key ? " profile-pill--active" : ""}`}
											aria-pressed={filter === key}
											onClick={() => setFilter(filter === key ? FILTER_ALL : key)}>
											{label}
										</button>
									))}
									<button
										type="button"
										className="profile-pill"
										aria-label="Cycle grouping"
										onClick={() =>
											setGroupBy(GROUP_ORDER[(GROUP_ORDER.indexOf(groupBy) + 1) % GROUP_ORDER.length])}>
										{`Group: ${GROUP_LABELS[groupBy]}`}
									</button>
									<Form.Control
										className="profile-search"
										type="search"
										aria-label="Search species or family"
										placeholder="Search species"
										value={search}
										onChange={(event) => setSearch(event.target.value)} />
								</div>

								<p className="profile-note">
									{"Filled tiles are recorded. Silhouettes are not recorded yet."}
								</p>

								<div aria-live="polite" className="mb-3">
									{selected &&
										<Card>
											<Card.Body>
												<Card.Title as="h3" className="h5">
													{selected.label}
												</Card.Title>
												<Card.Text className="mb-0">
													{`Species ${selected.id} · ${selected.family} · ${flockNameForSpecies(selected.id)} flock`}
													<br />
													{STATE_LABELS[data.states[selected.id]]}
													{supplyById?.[selected.id] === 1 && " · 1 of 1"}
													{typeof supplyById?.[selected.id] === "number" &&
														supplyById[selected.id] !== 1 &&
														` · ${supplyById[selected.id]} birds exist`}
												</Card.Text>
											</Card.Body>
										</Card>
									}
								</div>

								<BadgeGrid
									species={visibleSpecies}
									states={data.states}
									birdIds={data.birdIds}
									groupBy={groupBy}
									selectedId={selected?.id}
									supplyById={supplyById || undefined}
									onSelect={setSelected} />
							</div>

							<div className="profile-side">
								{isOwner && readyToRecord.length > 0 &&
									<div className="profile-ready-box">
										<b>{"Ready to record"}</b>
										<div className="profile-ready-text">
											{`${readyToRecord.length} species you hold or can claim.`}
										</div>
										<div className="profile-ready-tiles">
											{readyToRecord.slice(0, 6).map((species) => (
												<button
													key={species.id}
													type="button"
													className="profile-ready-tile"
													title={`${species.label} (${STATE_LABELS[data.states[species.id]]})`}
													aria-label={species.label}>
													{"?"}
												</button>
											))}
										</div>
									</div>
								}
								<b className="profile-side-title">{"Flock progress"}</b>
								<FlockProgress states={data.states} />
							</div>

						</div>

						<div className="profile-bottom-grid">

							<div className="profile-panel">
								<b className="profile-panel-title">{"Rarest finds"}</b>
								{rareFinds.length === 0 &&
									<div className="profile-muted-list">{"No rare finds yet."}</div>
								}
								{rareFinds.length > 0 &&
									<div className="profile-rare-tiles">
										{rareFinds.map((find) => (
											<RareTile
												key={find.birdId}
												birdId={find.birdId}
												label={find.label ?
													`${find.label} (1 of ${find.supply ?? "?"})` :
													"Rarest bird"} />
										))}
										</div>
								}
							</div>

							<div className="profile-panel">
								<b className="profile-panel-title">{"Recent activity"}</b>
								<div className="profile-muted-list">
									{data.events.length === 0 && "No activity yet."}
									{data.events.slice(0, 5).map((event, index) => (
										<div key={`${event.season}-${event.speciesId}-${index}`}>
											{`Recorded ${SPECIES_LABELS[event.speciesId] ?? `species ${event.speciesId}`} · ${dayjs(event.timestamp).format("MMM D, YYYY")}`}
										</div>
									))}
								</div>
							</div>

							<div className="profile-panel">
								<b className="profile-panel-title">{"Hall of Fame"}</b>
								<div className="profile-muted-list">
									{hallOfFame.length === 0 && "No Hall of Fame placements yet."}
									{hallOfFame.map((row) => (
										<div key={row.seasonId}>
											{`Season ${row.seasonId} trophy, place #${row.place}`}
										</div>
									))}
								</div>
							</div>

						</div>

						<h2 className="mt-4">{"Season history"}</h2>
						{seasonRows.length === 0 &&
							<p className="profile-note">{"No archived season points."}</p>
						}
						{seasonRows.length > 0 &&
							<div className="table-responsive season-table">
								<table className="table table-sm">
									<thead>
										<tr>
											<th scope="col">{"Season"}</th>
											<th scope="col">{"Birder Points"}</th>
										</tr>
									</thead>
									<tbody>
										{seasonRows.map((season) => (
											<tr key={season.id}>
												<td>
													<Link to={`/leaderboard?tab=hall-of-fame&season=${season.id}`}>
														{`Season ${season.id}`}
													</Link>
												</td>
												<td>{data.pointsBySeason[season.id]}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						}

					</>
				}
			</Container>
		</div>
	);

};

export default Profile;
