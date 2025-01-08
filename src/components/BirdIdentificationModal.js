import React, { useMemo, useState } from "react";
import {
    Transaction,
    TransactionButton,
    TransactionSponsor,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Button, Form, Modal } from "react-bootstrap";
import Select from "react-select";

import AccountOwner from "./AccountOwner";
import BirdAudioFile from "./BirdAudioFile";
import WalletConnectionStatus from "./WalletConnectionStatus";

import {
    ANSWER_CHOICES_FLOCK_2,
    ANSWER_CHOICES_FLOCK_3,
    ANSWER_CHOICES_FLOCK_4,
    ANSWER_CHOICES_FLOCK_5,
    COLLECTIONS,
    CURRENT_COLLECTION_MIN_ID,
    CURRENT_COLLECTION_MAX_ID,
} from "../constants";

import useBird from "../hooks/useBird";

import "./BirdIdentificationModal.css";

const BirdIdentificationModal = (props) => {

    const {
        id,
        cached,
        context,
        isOpen,
        onSubmitSmartWallet,
        onSubmitNonSmartWallet,
        onToggle,
    } = props;

    const [bird] = useBird({ id, cached, context });

    const [formData, setFormData] = useState({
        species: "",
    });

    const [contractCall, setContractCall] = useState([]);

    const handleInputChange = async (selectedOption) => {

        if (context.isPaymasterSupported) {

            // Reset the selected species to use as the guess so we can wait for the result
            // of the async API call to fetch the merkle proof for the "publicMint" contract call

            setContractCall([]);

            try {

                const result = await context.actions.publicMint(
                    bird.id,
                    selectedOption.value,
                );

                setContractCall([result]);

            } catch (error) {
                // TODO: Show an error message?
            }

        } else {
            setFormData({ species: selectedOption.value });
        }

    };

    // Handle submitting a new transaction for non-smart wallet users
    const handleSubmitNonSmartWallet = async () => {

        if (formData.species) {

            // Close the modal
            onToggle();

            // Submit the transaction
            await onSubmitNonSmartWallet(bird, formData.species);

        }

    };

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
                                    isDisabled={!context.account}
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
                                        {
                                            "If you submit an incorrect guess, you will be automatically refunded 0.00125 ETH."
                                        }
                                    </span>
                                </Form.Text>
                            </Form.Group>
                            {(!context.account || !context.isOnCorrectChain) && (
                                <WalletConnectionStatus />
                            )}
                            {context.account && context.isOnCorrectChain && (
                                <>
                                    {context.isPaymasterSupported && (
                                        <Transaction
                                            key={contractCall.length} // Re-mount when contract call changes
                                            address={context.account}
                                            className="bird-identification-transaction-container"
                                            capabilities={
                                                context.isPaymasterSupported
                                                    ? {
                                                          paymasterService: {
                                                              url: process.env
                                                                  .REACT_APP_COINBASE_PAYMASTER_AND_BUNDLER_ENDPOINT,
                                                          },
                                                      }
                                                    : null
                                            }
                                            contracts={contractCall}
                                            onError={(error) => {
                                                console.error(error);

                                                // TODO: Show more relevant error messages???
                                            }}
                                            onSuccess={(response) => {
                                                // Close the modal
                                                onToggle();

                                                // Handle and parse the successful response
                                                onSubmitSmartWallet(bird, response);
                                            }}
                                        >
                                            <TransactionButton
                                                className="btn btn-info w-100"
                                                disabled={contractCall.length === 0}
                                                text="Submit"
                                            />
                                            <TransactionSponsor text="SongBirdz" />
                                            <TransactionStatus>
                                                <TransactionStatusLabel />
                                                <TransactionStatusAction />
                                            </TransactionStatus>
                                        </Transaction>
                                    )}
                                    {!context.isPaymasterSupported && (
                                        <Button
                                            className="w-100"
                                            variant="info"
                                            onClick={handleSubmitNonSmartWallet}
                                        >
                                            {"Submit"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    }
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BirdIdentificationModal;
