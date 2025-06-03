import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { sdk } from "@farcaster/frame-sdk";

// TODO: Use await sdk.actions.addFrame() after the user has played a game or identified a bird
// TODO: Update index.html to launch into correct url based on the cast
// TODO: Add webhook handler + receive notifications when users install/uninstall the frame

const FarcasterContext = createContext()

export function FarcasterProvider({ children }) {

	const [context, setContext] = useState(null);

	const openLinkToChannel = useCallback(async (event) => {

		if (context) {
			event.preventDefault();
			await sdk.actions.openUrl('https://farcaster.xyz/~/channel/songbirdz');
		}

	}, []);

	const openLinkToOwner = useCallback(async (event) => {

		if (context) {
			event.preventDefault();
			await sdk.actions.viewProfile({ fid: 497095 });
		}

	}, []);

	const composeCast = useCallback(async (event, castParams) => {

		if (context) {
			event.preventDefault();
			await sdk.actions.composeCast({ ...castParams });
		}

	}, []);

	useEffect(() => {

		const load = async () => {

			const fContext = await sdk.context;

			setContext(fContext);

			await sdk.actions.ready();

		}

		load();

	}, []);

	return (
		<FarcasterContext.Provider value={{
			fContext: context,
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