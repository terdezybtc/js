import { formatBlock, formatTransaction } from "viem";
import { numberToHex } from "../utils/encoding/hex.js";
import { type ParseNFTOptions, parseNFT } from "../utils/nft/parseNft.js";
import type {
  Block,
  ChainsawBlock,
  ChainsawEvents,
  ChainsawNFTs,
  ChainsawTransaction,
  ChainsawTransactions,
  Events,
  NFTs,
  Transactions,
} from "./types.js";

/**
 * @internal
 */
export function formatChainsawBlock(block?: Block): ChainsawBlock | undefined {
  if (!block) return;
  return formatBlock({
    ...block,
    baseFeePerGas: block.baseFeePerGas
      ? numberToHex(BigInt(block.baseFeePerGas))
      : undefined,
    difficulty: numberToHex(BigInt(block.difficulty)),
    gasLimit: numberToHex(BigInt(block.gasLimit)),
    gasUsed: numberToHex(BigInt(block.gasUsed)),
  });
}

/**
 * @internal
 */
export function formatChainsawNFTs(nfts?: NFTs): ChainsawNFTs {
  if (!nfts) return [];
  return nfts.map((nft) => {
    let options: ParseNFTOptions;
    switch (nft.type) {
      case "ERC1155": {
        options = {
          tokenId: BigInt(nft.tokenId),
          owner: nft.ownerAddress || null,
          tokenUri: nft.uri,
          type: "ERC1155" as const,
          supply: BigInt(0),
        };
        break;
      }
      case "ERC721": {
        options = {
          tokenId: BigInt(nft.tokenId),
          owner: nft.ownerAddress || null,
          tokenUri: nft.uri,
          type: "ERC721" as const,
        };
        break;
      }
      default: {
        throw Error(`Unsupported NFT type ${nft.type}`);
      }
    }
    const parsedNft = parseNFT(
      {
        id: BigInt(nft.tokenId),
        uri: nft.uri,
        image: nft.image,
        description: nft.description,
        name: nft.name,
      },
      options,
    );
    return {
      ...parsedNft,
      contractAddress: nft.contractAddress,
      collectionName: nft.collectionName,
      chainId: nft.chainId,
      balance: BigInt(nft.balance || 1),
      ...(nft.imageData && { imageData: nft.imageData }),
    };
  });
}

/**
 * @internal
 */
export function formatChainsawTransactions(
  txs?: Transactions,
): ChainsawTransactions {
  if (!txs) return [];
  return txs.map((tx) => {
    if (tx.type === 0) {
      return formatTransaction({
        ...tx,
        type: "0x0",
        blockNumber: numberToHex(BigInt(tx.blockNumber)),
        value: numberToHex(BigInt(tx.value)),
        gasPrice: undefined,
        nonce: numberToHex(BigInt(tx.nonce)),
        maxPriorityFeePerGas: undefined,
        transactionIndex: numberToHex(BigInt(tx.index)),
      }) as ChainsawTransaction;
    }
    if (tx.type === 1) {
      return formatTransaction({
        ...tx,
        type: "0x1",
        blockNumber: numberToHex(BigInt(tx.blockNumber)),
        value: numberToHex(BigInt(tx.value)),
        gasPrice: numberToHex(BigInt(tx.gasPrice)),
        nonce: numberToHex(BigInt(tx.nonce)),
        maxPriorityFeePerGas: undefined,
        transactionIndex: numberToHex(BigInt(tx.index)),
      }) as ChainsawTransaction;
    }
    if (tx.type === 2) {
      return formatTransaction({
        ...tx,
        type: "0x2",
        blockNumber: numberToHex(BigInt(tx.blockNumber)),
        value: numberToHex(BigInt(tx.value)),
        nonce: numberToHex(BigInt(tx.nonce)),
        gasPrice: undefined,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas
          ? numberToHex(BigInt(tx.maxPriorityFeePerGas))
          : undefined,
        transactionIndex: numberToHex(BigInt(tx.index)),
      }) as ChainsawTransaction;
    }
    return formatTransaction({
      ...tx,
      type: "0x3",
      blockNumber: numberToHex(BigInt(tx.blockNumber)),
      value: numberToHex(BigInt(tx.value)),
      gasPrice: undefined,
      nonce: numberToHex(BigInt(tx.nonce)),
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? numberToHex(BigInt(tx.maxPriorityFeePerGas))
        : undefined,
      transactionIndex: numberToHex(BigInt(tx.index)),
    }) as ChainsawTransaction;
  });
}

/**
 * @internal
 */
export function formatChainsawEvents(events?: Events): ChainsawEvents {
  if (!events?.length) return [];
  return events.map((event) => ({
    ...event,
    count: BigInt(event.count),
  }));
}
