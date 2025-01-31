import { useCallback } from "react";

import useTransaction from "./useTransaction";

import { EVENTS } from "../constants";
import { populateMetadata, updateDailyStreak } from "../utils/data";

const useMintAPI = ({ context }) => {

    // Keep track of the state of back-end transactions
    const [txMint, setTxMint, resetTxMint] = useTransaction();

    const onMint = useCallback(async (bird, response) => {

        const receipt = response.transactionReceipts?.[0];

        if (!receipt) {
            return;
        }

        console.debug("------------ onMintSuccess (SW) -----------");
        console.debug(`gasUsed=${receipt.gasUsed}`);
        console.debug(response);
        console.debug("-------------------------------------------");

        const transactionHash = receipt.transactionHash;

        const eventLogs =
            receipt?.logs?.filter(
                (log) =>
                    log.address.toLowerCase() ===
                    context.contractAddress.toLowerCase(),
            ) || [];

        const events = eventLogs
            .map((log) => {
                return context.contractInterface.parseLog({
                    data: log.data,
                    topics: log.topics,
                });

                // Remove any events that were not parsed correctly
            })
            .filter((event) => Boolean(event));

        // Find the event(s) from the back-end

        const idEvent = events.find(
            (event) =>
                event.name === EVENTS.BIRD_ID &&
                parseInt(event.args?.birdId, 10) === bird.id &&
                event.args?.user?.toLowerCase() ===
                    context.account.toLowerCase(),
        );

        const transferEvent = events.find(
            (event) =>
                event.name === EVENTS.TRANSFER &&
                event.args?.from ===
                    "0x0000000000000000000000000000000000000000" &&
                event.args?.to?.toLowerCase() ===
                    context.account.toLowerCase() &&
                parseInt(event.args?.tokenId, 10) === bird.id,
        );

        // Check if the user successfully identified the bird, i.e. is now the owner
        let finalData, updatedTracker;

        if (transferEvent) {

            const updatedData = { ...bird, owner: context.account };

            // Update the metadata for the bird
            finalData = await populateMetadata(updatedData);

            // Update the daily streak for the user
            updatedTracker = await updateDailyStreak(context.account);

        }

        // Store the successful state for the transaction
        setTxMint({
            transactionHash,
            receipt,
            idEvent,
            transferEvent,
            timestamp: new Date(),
            success: true,
            bird: {
                ...bird,
                ...finalData,
            },
            // error: false,
            // errorMsg: null,
        });

        // Trigger the callback with the updated bird and daily streak data
        return [finalData, updatedTracker];

    }, []);

    const onError = useCallback((response) => {

        console.error(response);

        //  error: true,
        // errorMsg:
        // error?.data?.message || "Oops there was an error...",

    }, []);

    return { txMint, onMint, onError, resetTxMint };

};

export default useMintAPI;
