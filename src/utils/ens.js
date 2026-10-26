// Base-aware ENS / Basename universal resolver (same value AccountOwner used before)
export const ENS_UNIVERSAL_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583c7";

export const isEvmAddress = (value) => /^0x[a-fA-F0-9]{40}$/.test(value || "");

export const shortAddress = (address) => `${address.slice(0, 8)}...${address.slice(-3)}`;
