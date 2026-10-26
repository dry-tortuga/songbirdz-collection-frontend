import React, { useMemo, useState } from "react";
import {
	Alert,
	Button,
	ButtonGroup,
	Card,
	Col,
	Container,
	Form,
	ProgressBar,
	Row,
	Table,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";
import { useEnsAddress } from "wagmi";

import AccountOwner from "../components/AccountOwner";
import BadgeGrid from "../components/BadgeGrid";
import FlockProgress from "../components/FlockProgress";

import { NUM_SPECIES_TOTAL } from "../constants";
import { ARCHIVE_SEASONS } from "../constants/seasons";

import { useWalletContext } from "../contexts/wallet";

import useDailyStreak from "../hooks/useDailyStreak";
import useLifeList from "../hooks/useLifeList";

import { ENS_UNIVERSAL_RESOLVER, isEvmAddress } from "../utils/ens";
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

const StatCard = ({ label, children }) => (
	<Card className="profile-stat">
		<Card.Body>
			<div className="text-muted">{label}</div>
			{children}
		</Card.Body>
	</Card>
);

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

	const { data, loading, error } = useLifeList({ address });
	const tracker = useDailyStreak({ address });

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

			if (query &&
				!species.label.toLowerCase().includes(query) &&
				!species.family.toLowerCase().includes(query)) {
				return false;
			}

			return true;

		});

	}, [data, filter, search]);

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

	const seasonRows = data
		? ARCHIVE_SEASONS.filter((season) => data.pointsBySeason[season.id] > 0)
		: [];

	return (
		<div id="profile-page" className="profile-page">
			<Container className="mt-4">
				<Row className="mb-4 align-items-center">
					<Col xs="12" md>
						<h1 className="mb-1">{isOwner ? "My Profile" : "Profile"}</h1>
						<div className="d-flex align-items-center flex-wrap gap-3">
							<AccountOwner
								user={{ address }}
								size="lg"
								showLinkToProfile={false} />
							<a
								href={`https://basescan.org/address/${address}`}
								target="_blank"
								rel="noopener noreferrer nofollow">
								{"View on BaseScan"}
							</a>
						</div>
					</Col>
					<Col xs="12" md="auto" className="mt-3 mt-md-0">
						<Button
							as="a"
							variant="outline-primary"
							href={shareUrl}
							target="_blank"
							rel="noopener noreferrer">
							{"Share on X"}
						</Button>
					</Col>
				</Row>
				{loading &&
					<i className="fa-solid fa-spinner fa-spin fa-xl" role="status" aria-label="Loading Life List" />
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
						<Row className="g-3 mb-4">
							<Col xs="12" sm="6" lg="3">
								<StatCard label="Species">
									<div className="stat-value">
										{`${data.count} / ${NUM_SPECIES_TOTAL}`}
									</div>
									<ProgressBar
										className="mt-2"
										now={(data.count / NUM_SPECIES_TOTAL) * 100}
										aria-label={`${data.count} of ${NUM_SPECIES_TOTAL} species recorded`} />
								</StatCard>
							</Col>
							<Col xs="12" sm="6" lg="3">
								<StatCard label="Life List rank">
									<div className="stat-value">
										{typeof data.rank === "number" ? `#${data.rank}` : "Unranked"}
									</div>
								</StatCard>
							</Col>
							<Col xs="12" sm="6" lg="3">
								<StatCard label="Daily streak">
									<div className="stat-value">
										{tracker ? tracker.login_streak : 0}
									</div>
									{tracker &&
										<div className="text-muted">
											{`Longest ${tracker.longest_login_streak} (as of ${tracker.last_login})`}
										</div>
									}
								</StatCard>
							</Col>
							<Col xs="12" sm="6" lg="3">
								<StatCard label="Birder Points (archived seasons)">
									<div className="stat-value">{data.totalPoints}</div>
								</StatCard>
							</Col>
						</Row>
						<Row>
							<Col lg="8" className="mb-4">
								<h2>{"Life List"}</h2>
								<div className="d-flex flex-wrap align-items-center gap-2 mb-3">
									<ButtonGroup aria-label="Filter species">
										{[
											[FILTER_ALL, "All"],
											[FILTER_RECORDED, "Recorded"],
											[FILTER_MISSING, "Missing"],
										].map(([key, label]) => (
											<Button
												key={key}
												variant={filter === key ? "primary" : "outline-primary"}
												aria-pressed={filter === key}
												onClick={() => setFilter(key)}>
												{label}
											</Button>
										))}
									</ButtonGroup>
									<Form.Select
										className="w-auto"
										aria-label="Group species by"
										value={groupBy}
										onChange={(event) => setGroupBy(event.target.value)}>
										<option value="flock">{"Group by flock"}</option>
										<option value="family">{"Group by family"}</option>
										<option value="none">{"No grouping"}</option>
									</Form.Select>
									<Form.Control
										className="w-auto"
										type="search"
										aria-label="Search species or family"
										placeholder="Search species"
										value={search}
										onChange={(event) => setSearch(event.target.value)} />
								</div>
								<p className="text-muted">
									{"Filled badges are recorded. Silhouettes are not recorded yet."}
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
												</Card.Text>
											</Card.Body>
										</Card>
									}
								</div>
								<BadgeGrid
									species={visibleSpecies}
									states={data.states}
									groupBy={groupBy}
									selectedId={selected?.id}
									onSelect={setSelected} />
							</Col>
							<Col lg="4">
								<h2>{"Flock progress"}</h2>
								<FlockProgress states={data.states} />
								<h2 className="mt-4">{"Season history"}</h2>
								{seasonRows.length === 0 &&
									<p className="text-muted">{"No archived season points."}</p>
								}
								{seasonRows.length > 0 &&
									<Table size="sm">
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
									</Table>
								}
							</Col>
						</Row>
					</>
				}
			</Container>
		</div>
	);

};

export default Profile;
