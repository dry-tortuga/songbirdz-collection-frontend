import React, { createContext, useContext, useCallback, useState } from "react";
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
    const { setIsSendingGift, setBirdToGift } = useGiftContext();

    // True, if the modal is open
    const [isIdentifyingBird, setIsIdentifyingBird] = useState(false);
    const [birdToID, setBirdToID] = useState(null);
    const [onSuccessID, setOnSuccessID] = useState(null);

    const { currentUser, setCurrentUser } = context;

    const {
        txMint,
        onMint,
        onError,
        resetTxMint,
    } = useMintAPI({ context });

    const handleMintSuccess = useCallback(async (bird, statusData) => {

        const [updatedBird, updatedTracker] = await onMint(bird, statusData);

        if (updatedTracker) {

            setCurrentUser((prev) => ({
                ...prev,
                dailyStreakTracker: updatedTracker,
            }));

        }

        setBirdToGift(updatedBird);

        onSuccessID(updatedBird, updatedTracker);

    }, []);

    console.debug(currentUser?.dailyStreakTracker);

    return (
        <IdentificationContext.Provider
            value={{
                isIdentifyingBird,
                birdToID,
                txMint,
                setIsIdentifyingBird,
                setBirdToID,
                setOnSuccessID,
            }}>
            {children}
            {isIdentifyingBird && birdToID &&
                <BirdIdentificationModal
                    id={birdToID.id}
                    cached={false}
                    isOpen={isIdentifyingBird}
                    context={context}
                    onError={onError}
                    onSuccess={handleMintSuccess}
                    onToggle={() => {

                        setIsIdentifyingBird(false);
                        setBirdToID(null);
                        setOnSuccessID(null);

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
                        onSendGift={() => setIsSendingGift(true)} />
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
