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
			fOpenLinkToChannel: openLinkToChannel,
			fOpenLinkToOwner: openLinkToOwner,
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