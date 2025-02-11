const IS_HASH_USED_ABI = {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "hash",
            "type": "bytes32"
        }
    ],
    "name": "isHashUsed",
    "outputs": [
        {
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ],
    "stateMutability": "view",
    "type": "function"
};

// Callback function to check if gift pack hash is already used for smart wallet users
const isHashUsed = (hash: string, chainId: number, address: string) => {

	return {
		abi: [IS_HASH_USED_ABI],
		address,
		functionName: "isHashUsed",
		args: [hash],
		chainId,
	};

};

export default isHashUsed;
