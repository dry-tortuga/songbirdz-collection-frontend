import useTransaction from "./useTransaction";

import { EVENTS } from "../constants";
import { populateMetadata, updateDailyStreak } from "../utils/data";

const MINT_PRICE = "0.0015"; // 0.0015 ETH

const useMintAPI = ({ context, cb }) => {
  // Keep track of the state of back-end transactions
  const [txMintSmartWallet, setTxMintSmartWallet, resetTxMintSmartWallet] =
    useTransaction();
  const [
    txMintNonSmartWallet,
    setTxMintNonSmartWallet,
    resetTxMintNonSmartWallet,
  ] = useTransaction();

  const handleMintSmartWallet = async (bird, response) => {
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
          log.address.toLowerCase() === context.contractAddress.toLowerCase(),
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
        event.args?.user?.toLowerCase() === context.account.toLowerCase(),
    );

    const transferEvent = events.find(
      (event) =>
        event.name === EVENTS.TRANSFER &&
        event.args?.from === "0x0000000000000000000000000000000000000000" &&
        event.args?.to?.toLowerCase() === context.account.toLowerCase() &&
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
    setTxMintSmartWallet({
      transactionHash,
      receipt,
      idEvent,
      transferEvent,
      timestamp: new Date(),
      success: true,
      // error: false,
      // errorMsg: null,
    });

    // Trigger the callback with the updated bird and daily streak data
    cb(finalData, updatedTracker);
  };

  const handleMintNonSmartWallet = async (bird, speciesGuess) => {
    try {
      if (!context.isOnCorrectChain) {
        throw new Error(
          "Double check to make sure you're on the Base network!",
        );
      }

      // Fetch the merkle tree proof from the back-end server

      const proofParams = new URLSearchParams({ species_guess: speciesGuess });

      const response = await fetch(
        `${process.env.REACT_APP_SONGBIRDZ_BACKEND_URL}/birds/merkle-proof/${bird.id}?${proofParams}`,
      );

      if (response.status !== 200) {
        throw new Error(`Unable to fetch merkle proof for bird=${bird.id}...`);
      }

      const responseData = await response.json();

      // Store the pending state for the transaction
      setTxMintNonSmartWallet((prev) =>
        Object.assign({}, prev, {
          timestamp: null,
          transaction: null,
          pending: true,
          success: false,
          error: false,
          errorMsg: null,
        }),
      );

      // Build the transaction to mint the bird
      const [txSuccess, txError] =
        await context.actions.publicMintNonSmartWallet(
          bird.id,
          responseData.proof,
          responseData.species_guess,
          MINT_PRICE,
        );

      let events = [];

      if (txSuccess) {
        console.debug(`handleMint, gasUsed=${txSuccess.gasUsed}`);

        events = txSuccess.logs.map((log) => {
          return context.contractInterface.parseLog({
            data: log.data,
            topics: log.topics,
          });
        });
      }

      // Find the event(s) from the back-end

      const idEvent = events.find((event) => event.name === EVENTS.BIRD_ID);

      const transferEvent = events.find(
        (event) => event.name === EVENTS.TRANSFER,
      );

      // Store the success/error state for the transaction
      setTxMintNonSmartWallet((prev) => {
        return Object.assign({}, prev, {
          timestamp: new Date(),
          transaction: txSuccess,
          idEvent,
          transferEvent,
          pending: false,
          success: Boolean(txSuccess),
          error: Boolean(txError),
          errorMsg: txError,
        });
      });

      let finalData, updatedTracker;

      // Check if the user successfully identified the bird, i.e. is now the owner
      if (transferEvent) {
        const updatedData = { ...bird, owner: context.account };

        try {
          // Update the metadata for the bird
          finalData = await populateMetadata(updatedData);
        } catch (error) {
          console.error(error);
        }

        try {
          // Update the daily streak for the user
          updatedTracker = await updateDailyStreak(context.account);
        } catch (error) {
          console.error(error);
        }
      }

      // Notify the front-end of the event(s)
      cb(finalData, updatedTracker);
    } catch (error) {
      console.error(error);

      setTxMintNonSmartWallet((prev) =>
        Object.assign({}, prev, {
          timestamp: new Date(),
          transaction: null,
          idEvent: null,
          transferEvent: null,
          pending: false,
          success: false,
          error: true,
          errorMsg: error?.data?.message || "Oops there was an error...",
        }),
      );
    }
  };

  return {
    // Callback functions to submit the tx onchain
    handleMintSmartWallet,
    handleMintNonSmartWallet,

    // Keep track of the tx state
    txMintSmartWallet,
    txMintNonSmartWallet,

    // Reset the tx state
    resetTxMintSmartWallet,
    resetTxMintNonSmartWallet,
  };
};

export default useMintAPI;
