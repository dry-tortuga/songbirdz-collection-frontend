import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem } from "viem";

const SONGBIRDZ_CONTRACT_ADDRESS =
	process.env.REACT_APP_SONGBIRDZ_CONTRACT_ADDRESS;

const ZERO_ADDRESS =
	"0x0000000000000000000000000000000000000000";

const TRANSFER_EVENT = parseAbiItem(
	"event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

// ERC-721 transfer history for one bird, resolved against an on-chain RPC.
// Returns an empty result while loading; `available=false` when the chain
// doesn't support it (e.g. the local hardhat chain in development).
const useBirdHistory = (birdId) => {

	const client = usePublicClient();

	const [state, setState] = useState({
		available: Boolean(client && SONGBIRDZ_CONTRACT_ADDRESS),
		loading: true,
		transfers: [],
	});

	useEffect(() => {

		const enabled = Boolean(
			client &&
			SONGBIRDZ_CONTRACT_ADDRESS &&
			birdId !== undefined &&
			birdId !== null,
		);

		if (!enabled) {
			setState({ available: Boolean(client && SONGBIRDZ_CONTRACT_ADDRESS), loading: false, transfers: [] });
			return;
		}

		let cancelled = false;

		const load = async () => {

			setState({ available: true, loading: true, transfers: [] });

			let logs = [];

			try {
				logs = await client.getLogs({
					address: SONGBIRDZ_CONTRACT_ADDRESS,
					event: TRANSFER_EVENT,
					args: { tokenId: BigInt(birdId) },
					fromBlock: "earliest",
					toBlock: "latest",
				});
			} catch (error) {
				// Rate limits / RPC errors: show nothing rather than break the modal
				console.warn(`bird history failed for birdId=${birdId}`, error);
			}

			// Attach block timestamps (oldest first)
			const transfers = [];

			for (const log of logs) {

				let timestamp = null;

				try {
					const block = await client.getBlock({ blockNumber: log.blockNumber });
					timestamp = Number(block.timestamp) * 1000;
				} catch (error) {
					console.warn(`bird history block timestamp failed`, error);
				}

				const isMint = log.args.from?.toLowerCase() === ZERO_ADDRESS;

				transfers.push({
					txHash: log.transactionHash,
					from: log.args.from?.toLowerCase() || null,
					to: log.args.to?.toLowerCase() || null,
					isMint,
					timestamp,
				});

			}

			if (!cancelled) {
				setState({ available: true, loading: false, transfers });
			}

		};

		load();

		return () => {
			cancelled = true;
		};

	}, [client, birdId]);

	return state;

};

export default useBirdHistory;
