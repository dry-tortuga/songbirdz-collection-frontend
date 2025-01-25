import React, { useCallback, useMemo, useState } from "react";
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatusLabel,
    TransactionStatus,
    TransactionStatusAction,
    type LifecycleStatus,
} from "@coinbase/onchainkit/transaction";
import crypto from "crypto";
import { Modal } from "react-bootstrap";
import {
    type Hex,
    encodeAbiParameters,
    keccak256,
} from "viem";

import { useGiftItems } from "~/contexts/GiftItemsContext";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

import Password from "./components/Password.tsx";
import QrCode from "./components/QrCode.tsx";

import { useWalletContext } from "../../contexts/wallet";

type Props = {
    isOpen: boolean,
    bird: { id: string, species: string },
    onToggle: () => void,
};

const ONCHAIN_GIFT_URL = "https://www.onchaingift.com/";
const SALT_SEPARATOR = ":::";

const salt = useMemo(() => SALT_SEPARATOR + crypto.randomBytes(16).toString("hex"), []);

const CreateGiftPack = (props: Props) => {

    const {
        isOpen,
        bird,
        onToggle,
    } = props;

    const {
        account,
        contractAddress,
        onchainGiftContractAddress,
        isPaymasterSupported,
        actions,
    } = useWalletContext();

    const [password, setPassword] = useState<string>(
        `I think you're cuter than these ${bird.species}s!`
    );

    const salt = useMemo(() => SALT_SEPARATOR + crypto.randomBytes(16).toString('hex'), []);

    const [saltedPassword, setSaltedPassword] = useState<string>(password + salt);
    const [hash, setHash] = useState<Hex | null>(keccak256(encodeAbiParameters(
        [{ type: "string" }],
        [saltedPassword]
    )));
    const [isCreated, setIsCreated] = useState(false);

    // TODO: Replace with contract call manually?????
    const { data: isHashUsed } = api.engine.getIsHashUsed.useQuery({
        hash: hash ?? "",
    }, {
        enabled: !!hash,
    });

    // Encode and hash the password on changes
    const handleChangePassword = useCallback((password: string) => {

        const isValid = password.length > 0;

        if (isValid) {

            const newSaltedPassword = password + salt;

            setSaltedPassword(newSaltedPassword);
            setHash(keccak256(encodeAbiParameters(
                [{ type: "string" }],
                [newSaltedPassword]
            )));

        } else {
            setHash(null);
        }

        setPassword(password);

    }, []);

    const handleOnStatus = useCallback((status: LifecycleStatus) => {
        if (status.statusName === "success") {
            toast.success("Gift pack created!");
            setIsCreated(true);
        }
    }, []);

    const createGiftPackTransaction = useMemo(() => {

        const erc721Tokens = [{
            tokenAddress: contractAddress,
            tokenId: BigInt(bird.id),
        }];

        const finalHash = hash ?? keccak256(`0x0`);

        return actions.publicCreateGiftPack(erc721Tokens, finalHash);

    }, [hash]);

    const erc721ApprovalTransaction = useMemo(() => {

        const to = onchainGiftContractAddress;
        const tokenId = bird.id;

        return actions.approve(to, tokenId);

    }, []);

    return (
        <Modal
            className="create-gift-pack-modal"
            show={isOpen}
            onHide={onToggle}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {"Create a Songbirdz Gift Pack"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Password
                    account={account}
                    password={password}
                    saltedPassword={saltedPassword}
                    onChangePassword={handleChangePassword} />
                <div className="p-4 flex flex-col items-center justify-center">
                    <Transaction
                        address={account}
                        calls={[
                            erc721ApprovalTransaction,
                            createGiftPackTransaction,
                        ]}
                        capabilities={
                            isPaymasterSupported
                                ? {
                                      paymasterService: {
                                          url: process.env
                                              .REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT,
                                      },
                                  }
                                : null
                        }
                        onStatus={handleOnStatus}>
                        <TransactionButton
                            text="Create Gift Pack"
                            disabled={!hash}
                            className="px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400" />
                        <TransactionSponsor text="SongBirdz" />
                        <TransactionStatus>
                            <TransactionStatusLabel />
                            <TransactionStatusAction />
                        </TransactionStatus>
                    </Transaction>
                    {isCreated && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <p className="text-sm text-gray-600">
                                {"Share this link with the recipient:"}
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(password ?? "")}`}
                                    className="px-3 py-2 border border-gray-200 rounded-md w-64 text-sm" />
                                <button
                                    className="p-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => {
                                        void navigator.clipboard.writeText(`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(password ?? "")}`);
                                        toast.success("Copied to clipboard!");
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            void navigator.share({
                                                title: "Songbirdz Gift Pack",
                                                text: "I sent you a Songbirdz gift pack!",
                                                url: `${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(password ?? "")}`
                                            });
                                        }
                                    }}
                                    className="p-2 text-gray-600 hover:text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="18" cy="5" r="3"></circle>
                                        <circle cx="6" cy="12" r="3"></circle>
                                        <circle cx="18" cy="19" r="3"></circle>
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                </button>
                            </div>
                            <QrCode url={`${ONCHAIN_GIFT_URL}/claim/${encodeURIComponent(password ?? "")}`} />
                        </div>
                    )}
                    {isHashUsed && password.length > 0 && (
                        <p className="text-red-500 text-opacity-90 text-sm">
                            {"Please use a different message."}
                        </p>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default CreateGiftPack;
