import React, { createContext, useContext, useState } from "react";

import CreateGiftPack from "../components/CreateGiftPack/index.tsx";

const GiftContext = createContext({});

export const GiftProvider = ({ children }) => {

    const [birdToGift, setBirdToGift] = useState(null);

    return (
        <GiftContext.Provider
            value={{
                birdToGift,
                setBirdToGift
            }}>
            {children}
            {birdToGift &&
                <CreateGiftPack
                    bird={birdToGift}
                    isOpen={Boolean(birdToGift)}
                    onToggle={() => setBirdToGift(null)}  />
            }
        </GiftContext.Provider>
    );

};

export const useGiftContext = () => useContext(GiftContext);
