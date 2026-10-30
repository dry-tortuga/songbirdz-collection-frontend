import React, { useMemo, useState } from "react";
import { Alert, Container, Form, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";
import { useEnsAddress, useEnsName, usePublicClient } from "wagmi";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import { AccountAvatar } from "../components/AccountOwner";
import BadgeGrid from "../components/BadgeGrid";
import FlockProgress from "../components/FlockProgress";
import { FLOCK_HUES } from "../components/BadgeTile";

import { NUM_SPECIES_TOTAL } from "../constants";
import { ARCHIVE_SEASONS } from "../constants/seasons";

import { useWalletContext } from "../contexts/wallet";

import useDailyStreak from "../hooks/useDailyStreak";
import useBirdHistory from "../hooks/useBirdHistory";
import useLifeList from "../hooks/useLifeList";
import useSpeciesSupply from "../hooks/useSpeciesSupply";

const SONGBIRDZ_CONTRACT_ADDRESS =
	process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS;

import { ENS_UNIVERSAL_RESOLVER, isEvmAddress, shortAddress } from "../utils/ens";
import { birdImage, speciesBadgeSrc } from "../utils/data";
import {
	ALL_SPECIES,
	SPECIES_STATE,
	STATE_LABELS,
	flockIndexForSpecies,
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

const rarityLabel = (supply) => {

	if (supply === 1) {
		return { label: "Unique", detail: "1 of 1", variant: "unique" };
	}

	if (supply <= 5) {
		return { label: "Very rare", detail: `${supply} birds exist`, variant: "rare" };
	}

	if (supply <= 20) {
		return { label: "Rare", detail: `${supply} birds exist`, variant: "rare" };
	}

	return { label: "Common", detail: `${supply} birds exist`, variant: "common" };

};

const ACQUISITION_LABELS = {
	10: { label: "Minted · identified", variant: "mint" },
	3: { label: "Purchased on OpenSea", variant: "buy" },
	1: { label: "Purchased or transferred", variant: "transfer" },
};

const acquisitionFor = (points) =>
	ACQUISITION_LABELS[points === 10 ? 10 : points >= 3 ? 3 : 1];

const SpeciesModal = ({ species, state, supply, birdId, events, onClose }) => {

	const rarity = typeof supply === "number" ? rarityLabel(supply) : null;

	const isRecorded = state === SPECIES_STATE.RECORDED;

	const { available, loading, transfers } = useBirdHistory(
		species && isRecorded ? birdId : undefined);

	// BaseScan URL for the connected chain (undefined on other networks)
	const explorer =
		usePublicClient()?.chain?.blockExplorers?.default?.url;

	const openSeaUrl =
		SONGBIRDZ_CONTRACT_ADDRESS &&
		birdId !== null && birdId !== undefined &&
		`https://opensea.io/item/base/${SONGBIRDZ_CONTRACT_ADDRESS.toLowerCase()}/${birdId}`;

	const stateVariant = state === SPECIES_STATE.RECORDED
		? "recorded"
		: state === SPECIES_STATE.MISSING
			? "missing"
			: "held";

	// Scarcity meter: fewer birds = fuller bar
	const fill = rarity ? `${Math.round((1 - (supply - 1) / 49) * 100)}%` : "0%";

	return (
		<Modal show={Boolean(species)} onHide={onClose} centered className="species-modal">
			{species &&
				<>
					<Modal.Header
						className="species-modal__header"
						style={{ "--flock-hue": FLOCK_HUES[flockIndexForSpecies(species.id) % FLOCK_HUES.length] }}
						closeButton>
						<div className="species-modal__badge-box">
							<img
								className="species-modal__badge"
								src={speciesBadgeSrc(species.id)}
								alt=""
								loading="lazy"
								onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
						</div>
						<div className="species-modal__heading">
							<Modal.Title>
								{species.label}
							</Modal.Title>
							<div className="species-modal__meta">
								{`${species.family} · ${flockNameForSpecies(species.id)} flock`}
							</div>
						</div>
					</Modal.Header>
					<Modal.Body>

						<div className="species-modal__row">
							<span className={`species-modal__chip species-modal__chip--${stateVariant}`}>
								{STATE_LABELS[state]}
							</span>
							{rarity &&
								<span className={`species-modal__chip species-modal__chip--${rarity.variant}`}>
									{`${rarity.label} · ${rarity.detail}`}
								</span>
							}
						</div>

						{rarity &&
							<div className="species-modal__meter" aria-label="Species scarcity">
								<span
									className={`species-modal__meter-fill species-modal__meter-fill--${rarity.variant}`}
									style={{ width: fill }} />
							</div>
						}

						{isRecorded && birdId !== null && birdId !== undefined &&
							<div className="species-modal__bird">
								<img src={birdImage(birdId)} alt="" loading="lazy" />
								<div className="species-modal__bird-info">
									<span>{`Your Songbird #${birdId}`}</span>
									{openSeaUrl &&
										<a href={openSeaUrl} target="_blank" rel="noopener noreferrer nofollow">
											{"View on OpenSea"}
										</a>
									}
								</div>
							</div>
						}

						<div className="species-modal__history">
							<b>{"History"}</b>
							<div className="species-modal__history-list">

								{loading && (available && isRecorded && birdId !== null) &&
									<div className="species-modal__history-row">
										{"Loading on-chain transfers…"}
									</div>
								}

								{!loading && transfers.length > 0 && transfers.map((transfer, index) => (
									<div
										key={`${transfer.txHash}-${index}`}
										className="species-modal__history-row">
										<span
											className={`species-modal__method species-modal__method--${transfer.isMint ? "mint" : "trade"}`}>
											{transfer.isMint ? "Minted" : "Traded"}
										</span>
										<time dateTime={dayjs(transfer.timestamp).format("YYYY-MM-DD")}>
											{transfer.timestamp ?
												dayjs(transfer.timestamp).format("MMM D, YYYY") :
												`Block #${transfer.blockNumber}`}
										</time>
										{explorer && transfer.txHash &&
											<a
												href={`${explorer}/tx/${transfer.txHash}`}
												target="_blank"
												rel="noopener noreferrer nofollow">
												{`tx ${transfer.txHash.slice(0, 8)}…${transfer.txHash.slice(-6)}`}
											</a>
										}
									</div>
								))}

								{!loading && transfers.length === 0 && events.map((event, index) => {

									const method = acquisitionFor(event.points);

									return (
										<div
											key={`${event.birdId ?? "no-bird"}-${event.timestamp ?? index}-${index}`}
											className="species-modal__history-row">
											<span className={`species-modal__method species-modal__method--${method.variant}`}>
												{method.label}
											</span>
											{event.timestamp &&
												<time dateTime={dayjs(event.timestamp).format("YYYY-MM-DD")}>
													{dayjs(event.timestamp).format("MMM D, YYYY")}
												</time>
											}
											{event.birdId !== null &&
												<span className="species-modal__history-muted">
													{`Songbird #${event.birdId}`}
												</span>
											}
										</div>
									);

								})}

								{!loading && transfers.length === 0 && events.length === 0 &&
									<div className="species-modal__history-row">
										{"No history for this species yet."}
									</div>
								}

							</div>
						</div>

					</Modal.Body>
				</>
			}
		</Modal>
	);

};

SpeciesModal.propTypes = {
	species: PropTypes.shape({
		id: PropTypes.number.isRequired,
		label: PropTypes.string.isRequired,
		family: PropTypes.string.isRequired,
	}),
	state: PropTypes.string,
	supply: PropTypes.number,
	birdId: PropTypes.number,
	events: PropTypes.arrayOf(PropTypes.shape({
		season: PropTypes.number,
		speciesId: PropTypes.number,
		birdId: PropTypes.number,
		points: PropTypes.number,
		timestamp: PropTypes.number,
	})),
	onClose: PropTypes.func.isRequired,
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
// Shareable deep-links: /profile/<addr>?species=<id> opens that species' details
const deepLinkedSpeciesId = (() => {

	const id = parseInt(new URLSearchParams(window.location.search).get("species"), 10);

	return ALL_SPECIES.some((species) => species.id === id) ? id : null;

})();

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
	const [selected, setSelected] = useState(() =>
		ALL_SPECIES.find((species) => species.id === deepLinkedSpeciesId) || null);

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
							{data.totalPoints ?? data.pointsBySeason[latestSeason] ?? 0}
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
									<span className="visually-hidden">
										{`Selected: ${selected.label}`}
									</span>
								}
							</div>

							<BadgeGrid
									species={visibleSpecies}
									states={data.states}
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

				<SpeciesModal
					species={selected}
					state={selected ? data?.states?.[selected.id] : undefined}
					supply={selected ? supplyById?.[selected.id] : undefined}
					birdId={selected ? data?.birdIds?.[selected.id] : undefined}
					events={
						selected && data
							? data.events.filter((event) => event.speciesId === selected.id)
							: []
					}
					onClose={() => setSelected(null)} />
			</Container>
		</div>
	);

};

export default Profile;
