import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";

import BirdIdentificationModal from "../components/BirdIdentificationModal";
import BirdIdentificationTransactionStatus from "../components/BirdIdentificationTransactionStatus";
import DailyStreakStatus from "../components/DailyStreakStatus";

import useMintAPI from "../hooks/useMintAPI";

import { useGiftContext } from "./gift";
import { useWalletContext } from "./wallet";

const IdentificationContext = createContext({});

export const IdentificationProvider = ({ children }) => {

    const context = useWalletContext();
    const { setBirdToGift } = useGiftContext();

    // True, if the modal is open
    const [isIdentifyingBird, setIsIdentifyingBird] = useState(false);
    const [birdToID, setBirdToID] = useState(null);

    const { currentUser, setCurrentUser } = context;

    const {
        txMint,
        onMint,
        onError,
        resetTxMint,
    } = useMintAPI();

    const handleMintSuccess = useCallback(async (bird, statusData) => {

        const [updatedBird, updatedTracker] = await onMint(bird, statusData);

        if (updatedBird) {

            setCurrentUser((prev) => ({
                dailyStreakTracker: updatedTracker || prev.dailyStreakTracker,
                identified: {
                    ...prev.identified,
                    [updatedBird.id]: updatedBird,
                },
            }));

        }

    }, [onMint]);

    // Re-load the twitter share button if the identified bird changes
    useEffect(() => {

        if (window.twttr?.widgets) {
            window.twttr.widgets.load(document.getElementById("bird-identification-tx-status-twitter-share-btn"));
        }

    }, [birdToID]);

    return (
        <IdentificationContext.Provider
            value={{
                isIdentifyingBird,
                birdToID,
                txMint,
                setIsIdentifyingBird,
                setBirdToID,
            }}>
            {children}
            {isIdentifyingBird && birdToID &&
                <BirdIdentificationModal
                    id={birdToID.id}
                    cached={Boolean(birdToID?.cached)}
                    isOpen={isIdentifyingBird}
                    context={context}
                    onError={onError}
                    onSuccess={handleMintSuccess}
                    onToggle={() => {

                        setIsIdentifyingBird(false);
                        setBirdToID(null);

                    }} />
            }
            <ToastContainer
                className="p-3"
                style={{ zIndex: 5 }}
                position="top-end">
                {(txMint?.pending ||
                    txMint?.success ||
                    txMint?.error) && (
                    <BirdIdentificationTransactionStatus
                        tx={txMint}
                        onClose={resetTxMint}
                        onSendGift={(bird) => setBirdToGift(bird)} />
                )}
                {(currentUser?.dailyStreakTracker?.status ===
                    "created" ||
                    currentUser?.dailyStreakTracker?.status ===
                        "updated") && (
                    <DailyStreakStatus
                        data={currentUser?.dailyStreakTracker} />
                )}
            </ToastContainer>
        </IdentificationContext.Provider>
    );

};

export const useIdentificationContext = () => useContext(IdentificationContext);
