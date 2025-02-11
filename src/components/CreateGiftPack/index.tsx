import React, { useCallback, useEffect, useMemo, useState } from "react";
import { readContract } from "@wagmi/core";
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatusLabel,
    TransactionStatus,
    TransactionStatusAction,
    type LifecycleStatus,
} from "@coinbase/onchainkit/transaction";
import { Modal } from "react-bootstrap";
import {
    encodeAbiParameters,
    keccak256,
} from "viem";

import createPack from "./actions/createPack.tsx";
import isHashUsed from "./actions/isHashUsed.tsx";
import Password from "./components/Password.tsx";
// import QrCode from "./components/QrCode.tsx";

import config from "../../config";
import { useWalletContext } from "../../contexts/wallet";
import useDebounce from "../../hooks/useDebounce";

type Props = {
    isOpen: boolean,
    bird: { id: string, species: string },
    onToggle: () => void,
};

const ONCHAIN_GIFT_URL = "https://www.onchaingift.com";
const SALT_SEPARATOR = ":::";

const generateSaltedPassword = (password: string, salt: string) => password + salt;
const generateHashedPassword = (saltedPassword: string) =>
    keccak256(encodeAbiParameters([{ type: "string" }], [saltedPassword]))

const CreateGiftPack = (props: Props) => {

    const {
        bird,
        isOpen,
        onToggle,
    } = props;

    const {
        account,
        contractAddress,
        onchainGiftContractAddress,
        expectedChainId,
        isPaymasterSupported,
        actions,
    } = useWalletContext();

    const salt = useMemo(() => {

        const randomBytes = crypto.getRandomValues(new Uint8Array(16));

        const randomHex = randomBytes.reduce((result, value) => {
            return result + value.toString(16).padStart(2, '0');
        }, '');

        return SALT_SEPARATOR + randomHex;

    }, []);

    const [password, setPassword] = useState<string>(`I think you're cuter than these ${bird.species}s!`);
    const [saltedPassword, setSaltedPassword] = useState<string>(
        generateSaltedPassword(password, salt)
    );
    const [hash, setHash] = useState<object>({
        value: generateHashedPassword(saltedPassword),
        isValid: false,
        loading: false,
    });

    const [isCreated, setIsCreated] = useState(false);
    const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);

    const debouncedHash = useDebounce(hash, 500);

    // Encode and hash the password on changes
    const handleChangePassword = useCallback((newValue: string) => {

        const isValid = newValue.length > 0;

        if (isValid) {

            const newSaltedPassword = generateSaltedPassword(newValue, salt);
            const newHash = generateHashedPassword(newSaltedPassword);

            setSaltedPassword(newSaltedPassword);
            setHash({ value: newHash, isValid: false, loading: true });

        } else {
            setHash({ value: null, isValid: false, loading: false });
        }

        setPassword(newValue);

    }, []);

    const handleOnStatus = useCallback((status: LifecycleStatus) => {

        if (status.statusName === "success") {
            setIsCreated(true);
        } else if (status.statusName === "error") {
            console.error(status);
            // TODO: Error handler
        } else {
            console.debug(status);
        }
    }, []);

    const createGiftPackTransaction = useMemo(() => {

        const erc721Tokens = [{
            tokenAddress: contractAddress,
            tokenId: BigInt(bird.id),
        }];

        const finalHash = hash.value ?? keccak256(`0x0`);

        return createPack(
            erc721Tokens,
            finalHash,
            expectedChainId,
            onchainGiftContractAddress,
        );

    }, [hash.value, expectedChainId, onchainGiftContractAddress]);

    const erc721ApprovalTransaction = useMemo(() => {

        const to = onchainGiftContractAddress;
        const tokenId = BigInt(bird.id);

        return actions.approve(to, tokenId);

    }, [onchainGiftContractAddress]);

    useEffect(() => {

        if (!debouncedHash.loading) { return; }

        const checkHashStatus = async () => {

            try {

                const alreadyUsed = await readContract(
                    config,
                    isHashUsed(
                        debouncedHash.value,
                        expectedChainId,
                        onchainGiftContractAddress,
                    )
                );

                setHash((prev) => ({ ...prev, isValid: !alreadyUsed, loading: false }));

            } catch (error) {
                console.error(error);
                setHash((prev) => ({ ...prev, isValid: false, loading: false }));
            }

        };

        checkHashStatus();

    }, [debouncedHash, expectedChainId, onchainGiftContractAddress]);

    return (
        <Modal
            className="create-gift-pack-modal"
            show={isOpen}
            onHide={onToggle}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {`Send ${bird.name} as a Gift`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Password
                    account={account}
                    password={password}
                    saltedPassword={saltedPassword}
                    onChangePassword={handleChangePassword} />
                {hash.value && !hash.loading && !hash.isValid && password.length > 0 && (
                    <p className="text-danger text-center small mt-2">
                        {"Please use a different message."}
                    </p>
                )}
                <img
                    className="mt-3"
                    src={bird.image}
                    style={{
                        width: "60%",
                        height: "auto",
                        marginLeft: "20%",
                        marginRight: '20%',
                        borderRadius: 8,
                    }}
                    alt="" />
                <div className="text-center">
                    {`${bird.name} -> ${bird.species}`}
                </div>
                <div className="mt-3 flex flex-col items-center justify-center">
                    <Transaction
                        address={account}
                        calls={[
                            erc721ApprovalTransaction,
                            createGiftPackTransaction,
                        ]}
                        isSponsored={isPaymasterSupported}
                        onStatus={handleOnStatus}>
                        <TransactionButton
                            text="Create Gift"
                            disabled={!hash.value || !hash.isValid}
                            className="px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400" />
                        <TransactionSponsor text="SongBirdz" />
                        <TransactionStatus>
                            <TransactionStatusLabel />
                            <TransactionStatusAction />
                        </TransactionStatus>
                    </Transaction>
                    {isCreated && (
                        // TODO: Add back toasts...
                        <div className="w-100 flex flex-col items-center gap-2 border border-gray-200 p-4 rounded">
                            <p className="text-sm text-gray-600 fw-bold">
                                {"Share this link with the recipient:"}
                            </p>
                            <div className="flex items-center gap-2 w-100">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(saltedPassword ?? "")}`}
                                    className="px-3 py-2 border border-gray-200 rounded-md w-100 text-sm" />
                                <button
                                    className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                                    onClick={() => {
                                        void navigator.clipboard.writeText(`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(saltedPassword ?? "")}`);
                                        setIsCopiedToClipboard(true);
                                        setTimeout(() => setIsCopiedToClipboard(false), 3000);
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                </button>
                                {navigator.share &&
                                    <button
                                        onClick={() => {
                                            void navigator.share({
                                                title: "Songbirdz Gift Pack",
                                                text: "I sent you a Songbirdz gift pack!",
                                                url: `${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(saltedPassword ?? "")}`
                                            });
                                        }}
                                        className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="18" cy="5" r="3"></circle>
                                            <circle cx="6" cy="12" r="3"></circle>
                                            <circle cx="18" cy="19" r="3"></circle>
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                        </svg>
                                    </button>
                                }
                            </div>
                            {isCopiedToClipboard &&
                                <div className="text-sm fw-bold">
                                    {'Copied to clipboard!'}
                                </div>
                            }
                            {/* <QrCode url={`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(password ?? "")}`} /> */}
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default CreateGiftPack;
