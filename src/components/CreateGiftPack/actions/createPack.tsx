const CREATE_PACK_ABI = {
    "inputs": [
        {
            "components": [
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "internalType": "struct GiftPack.ERC20Token[]",
            "name": "erc20Tokens",
            "type": "tuple[]"
        },
        {
            "components": [
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "internalType": "struct GiftPack.ERC721Token[]",
            "name": "erc721Tokens",
            "type": "tuple[]"
        },
        {
            "components": [
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "internalType": "struct GiftPack.ERC1155Token[]",
            "name": "erc1155Tokens",
            "type": "tuple[]"
        },
        {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "createPack",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "payable",
    "type": "function"
};

// Callback function to create a new bird gift pack for smart wallet users
const createPack = (erc721Tokens: Array<object>, giftHash: string, chainId: number, address: string) => {

    const ethToSend = 0;
    const erc20Tokens = [];
    const erc1155Tokens = [];

    return {
        abi: [CREATE_PACK_ABI],
        address,
        functionName: "createPack",
        args: [
            ethToSend,
            erc20Tokens,
            erc721Tokens,
            erc1155Tokens,
            giftHash,
        ],
        chainId,
    };

};

export default createPack;
