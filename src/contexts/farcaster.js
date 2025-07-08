import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

// TODO: Update index.html to launch into correct url based on the cast
// TODO: Add webhook handler + receive notifications when users install/uninstall the frame

const FarcasterContext = createContext()

export function FarcasterProvider({ children }) {

	const [context, setContext] = useState(null);

	const addMiniApp = useCallback(async () => {
		if (context) {
			try {
				await sdk.actions.addMiniApp();
			} catch (error) {
				console.error(error);
			}
		}
	}, [context]);

	const openExternalURL = useCallback(async (event) => {

		if (context) {
			event.preventDefault();
			try {
				const url = event.target.href;
				await sdk.actions.openUrl(url);
			} catch (error) {
				console.error(error);
			}
		}

	}, [context]);

	const openLinkToChannel = useCallback(async (event) => {

		if (context) {
			event.preventDefault();
			try {
				await sdk.actions.openUrl('https://farcaster.xyz/~/channel/songbirdz');
			} catch (error) {
				console.error(error);
			}
		}

	}, [context]);

	const openLinkToUser = useCallback(async (fid) => {

		if (context) {
			try {
				await sdk.actions.viewProfile({ fid });
			} catch (error) {
				console.error(error);
			}
		}

	}, [context]);

	const openLinkToOwner = useCallback(async (event) => {

		if (context) {
			event.preventDefault();
			try {
				await sdk.actions.viewProfile({ fid: 497095 });
			} catch (error) {
				console.error(error);
			}
		}

	}, [context]);

	const composeCast = useCallback(async (event, castParams) => {

		if (context) {
			event.preventDefault();
			try {
				await sdk.actions.composeCast({ ...castParams });
			} catch (error) {
				console.error(error);
			}
		}

	}, [context]);

	const populateFarcasterUsers = useCallback(async (users) => {

		console.log('Fetching farcaster user data....');

		const result = [...users];

		const options = {
			method: 'GET',
			headers: { 'x-api-key': process.env.REACT_APP_NEYNAR_API_KEY },
		};

		const url =
			'https://api.neynar.com/v2/farcaster/user/bulk-by-address/' +
			`?addresses=${result.map((user) => user.address).join(',')}`

		try {

			const response = await fetch(url, options);

			const data = await response.json();

			console.log(data);

			// Loop through each user and populate with farcaster data (if any)
			for (let i = 0; i < result.length; i++) {

				const farcasterUserData = data[result[i].address.toLowerCase()]?.[0] || null;

				result[i] = { ...result[i], farcaster: farcasterUserData };

			}

		} catch (err) {
			console.error(err);
		}

		return result;

	});

	useEffect(() => {

		const load = async () => {

			try {

				const fContext = await sdk.context;

				setContext(fContext);

				// Hide the splash screen
				await sdk.actions.ready();

				// Integrate with a back navigation control provided by the Farcaster client
				await sdk.back.enableWebNavigation();

			} catch (error) {
				console.error(error);
			}

		}

		load();

	}, []);

	return (
		<FarcasterContext.Provider value={{
			fContext: context,
			fAddMiniApp: addMiniApp,
			fComposeCast: composeCast,
			fOpenExternalURL: openExternalURL,
			fOpenLinkToChannel: openLinkToChannel,
			fOpenLinkToUser: openLinkToUser,
			fOpenLinkToOwner: openLinkToOwner,
			fPopulateUsers: populateFarcasterUsers,
		}}>
			{children}
		</FarcasterContext.Provider>
	)
}

export function useFarcasterContext() {
	const context = useContext(FarcasterContext);
	if (!context) {
		throw new Error("useFarcasterContext must be used within FarcasterProvider");
	}
	return context;
}