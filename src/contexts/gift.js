import React, { createContext, useContext, useState } from "react";

import CreateGiftPack from "../components/CreateGiftPack/index.tsx";

const GiftContext = createContext({});

export const GiftProvider = ({ children }) => {

    const [isSendingGift, setIsSendingGift] = useState(false);
    const [birdToGift, setBirdToGift] = useState(null);

    return (
        <GiftContext.Provider
            value={{
                isSendingGift,
                setIsSendingGift,
                birdToGift,
                setBirdToGift
            }}>
            {children}
            {isSendingGift && birdToGift &&
                <CreateGiftPack
                    bird={birdToGift}
                    isOpen={isSendingGift}
                    onToggle={() => setIsSendingGift(false)}  />
            }
        </GiftContext.Provider>
    );

};

export const useGiftContext = () => useContext(GiftContext);
