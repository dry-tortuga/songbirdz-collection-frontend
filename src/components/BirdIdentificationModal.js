import React, { useCallback, useMemo, useState } from "react";
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Form, Modal } from "react-bootstrap";
import Select from "react-select";

import AccountOwner from "./AccountOwner";
import BirdAudioFile from "./BirdAudioFile";
import WalletConnectionStatus from "./WalletConnectionStatus";

import {
    ANSWER_CHOICES_FLOCK_2,
    ANSWER_CHOICES_FLOCK_3,
    ANSWER_CHOICES_FLOCK_4,
    ANSWER_CHOICES_FLOCK_5,
    ANSWER_CHOICES_FLOCK_6,
    ANSWER_CHOICES_FLOCK_7,
    ANSWER_CHOICES_FLOCK_8,
    COLLECTIONS,
} from "../constants";

import { useWalletContext } from "../contexts/wallet";

import useBird from "../hooks/useBird";

import "./BirdIdentificationModal.css";

const BirdIdentificationModal = (props) => {

    const {
        id,
        cached,
        isOpen,
        onError,
        onSuccess,
        onToggle,
    } = props;

    const context = useWalletContext();

    const [bird] = useBird({ id, cached, context });

    const [formData, setFormData] = useState({ species: "" });

    const {
        account,
        expectedChainId,
        isOnCorrectChain,
        isPaymasterSupported,
        actions,
    } = context;

    const handleInputChange = (selectedOption) => {
        setFormData({ species: selectedOption.value });
    };

    const handleOnStatus = useCallback((status) => {

        if (status.statusName === "success") {

            // Handle and parse the successful response
            onSuccess(bird, status.statusData);

            // Close the modal
            onToggle();

        } else if (status.statusName === "error") {

            console.error(status);
            onError(bird, status.statusData);

        }

    }, [bird]);

    const options = useMemo(() => {

        if (!bird || bird.id < 2000) { return []; }

        const collection = COLLECTIONS.find(
            (temp) => bird.id >= temp.min_id && bird.id <= temp.max_id,
        );

        let answerChoices;

        if (bird.id >= 2000 && bird.id <= 2999) {
            answerChoices = ANSWER_CHOICES_FLOCK_2;
        } else if (bird.id >= 3000 && bird.id <= 3999) {
            answerChoices = ANSWER_CHOICES_FLOCK_3;
        } else if (bird.id >= 4000 && bird.id <= 4999) {
            answerChoices = ANSWER_CHOICES_FLOCK_4;
        } else if (bird.id >= 5000 && bird.id <= 5999) {
            answerChoices = ANSWER_CHOICES_FLOCK_5;
        } else if (bird.id >= 6000 && bird.id <= 6999) {
            answerChoices = ANSWER_CHOICES_FLOCK_6;
        } else if (bird.id >= 7000 && bird.id <= 7999) {
            answerChoices = ANSWER_CHOICES_FLOCK_7;
        } else if (bird.id >= 8000 && bird.id <= 8999) {
            answerChoices = ANSWER_CHOICES_FLOCK_8;
        }

        // Get the bird's final index relative to ONLY the current collection
        const finalIndex = bird.id - collection.min_id;

        const result = answerChoices[finalIndex].options.map((name) => ({
            label: name,
            value: name,
        }));

        result.sort((a, b) => {

            if (a.value < b.value) {
                return -1;
            }

            if (a.value > b.value) {
                return 1;
            }

            return 0;

        });

        return result;

    }, [bird?.id]);

    // Reset the selected species to use as the guess so we can wait for the result
    // of the async API call to fetch the merkle proof for the "publicMint" contract call

    const callsCallback = useMemo(() => {

        const mint = async () => {

            const result = await actions.publicMint(
                bird.id,
                formData.species,
            );

            return [result];

        };

        return mint;

    }, [formData.species]);

    /*
    useEffect(() => {

        const button = document.querySelector('button[data-testid="ockConnectButton"]');

        console.debug('button-listener');
        console.debug(button);

        // Close the modal
        const handleClick = () => { onToggle(); };

        button?.addEventListener('click', handleClick);

        return () => {
            button?.removeEventListener('click', handleClick);
        };

    }, [account, isOnCorrectChain]);
    */

    // Extra safety check here to prevent users from submitting invalid transactions...
    if (!bird) {
        return null;
    }

    return (
        <Modal
            className="bird-identification-modal"
            show={isOpen}
            onHide={onToggle}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {bird.owner ? bird.name : `Identify ${bird.name}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <img
                            style={{
                                width: "50%",
                                height: "auto",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            src={bird.image} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="song-audio">
                        <Form.Label className="d-block fw-bold">
                            {"Song Audio"}
                        </Form.Label>
                        <BirdAudioFile className="w-100" birdId={bird.id} />
                    </Form.Group>
                    {bird.owner &&
                        <>
                            <Form.Group className="mb-3" controlId="bird-species">
                                <Form.Label className="d-block fw-bold">
                                    {"Species"}
                                </Form.Label>
                                <div>
                                    {bird.species}
                                </div>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="bird-owner"
                                style={{ position: 'relative' }}>
                                <Form.Label className="d-block fw-bold">
                                    {"Owner"}
                                </Form.Label>
                                <AccountOwner
                                    className="w-100"
                                    account={bird.owner} />
                                <span
                                    style={{
                                        position: 'absolute',
                                        bottom: 5,
                                        right: 5,
                                    }}>
                                    <a
                                        href={`/collection/${bird.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow">
                                        <i
                                            className="fa-solid fa-arrow-up-right-from-square"
                                            style={{ fontSize: "18px" }} />
                                    </a>
                                </span>
                            </Form.Group>
                        </>
                    }
                    {!bird.owner &&
                        <>
                            <Form.Group className="mb-3" controlId="species">
                                <Form.Label className="fw-bold">{"Species"}</Form.Label>
                                <Select
                                    id="species"
                                    name="species"
                                    className="bird-identification-species-selector"
                                    classNamePrefix="bird-identification-species"
                                    options={options}
                                    isDisabled={!account}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Text className="d-block">
                                    <span className="fw-bold me-2">{"PRICE: "}</span>
                                    <span>{"0.0015 ETH"}</span>
                                </Form.Text>
                                <Form.Text className="text-muted d-block">
                                    <span className="fw-bold me-2">{"NOTE: "}</span>
                                    <span>
                                        {"If you submit an incorrect guess, you will be automatically refunded 0.00125 ETH."}
                                    </span>
                                </Form.Text>
                            </Form.Group>
                            {(!account || !isOnCorrectChain) && (
                                <>
                                    {!account &&
                                        <span className="fw-bold">
                                            {"Please connect your wallet..."}
                                        </span>
                                    }
                                    {account && !isOnCorrectChain &&
                                        <WalletConnectionStatus />
                                    }
                                </>
                            )}
                            {account && isOnCorrectChain && (
                                <Transaction
                                    address={account}
                                    className="bird-identification-transaction-container"
                                    chainId={expectedChainId}
                                    calls={callsCallback}
                                    isSponsored={isPaymasterSupported}
                                    onStatus={handleOnStatus}>
                                    <TransactionButton
                                        className="btn btn-info w-100"
                                        disabled={!formData.species}
                                        text="Submit" />
                                    <TransactionSponsor text="SongBirdz" />
                                    <TransactionStatus>
                                        <TransactionStatusLabel />
                                        <TransactionStatusAction />
                                    </TransactionStatus>
                                </Transaction>
                            )}
                        </>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BirdIdentificationModal;
