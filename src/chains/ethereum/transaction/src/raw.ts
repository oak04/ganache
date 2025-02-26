import { AccessListBuffer } from "@ethereumjs/tx";
/**
 * The raw data for an ethereum transaction.
 */

type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type TxType = [type: Buffer];

export type LegacyDatabasePayload = [
  nonce: Buffer,
  gasPrice: Buffer,
  gas: Buffer,
  to: Buffer,
  value: Buffer,
  data: Buffer,
  v: Buffer,
  r: Buffer,
  s: Buffer
];

export type EIP2930AccessListDatabasePayload = [
  chainId: Buffer,
  nonce: Buffer,
  gasPrice: Buffer,
  gas: Buffer,
  to: Buffer,
  value: Buffer,
  data: Buffer,
  accessList: AccessListBuffer,
  v: Buffer,
  r: Buffer,
  s: Buffer
];

export type EIP2930AccessListDatabaseTx = Concat<
  TxType,
  EIP2930AccessListDatabasePayload
>;

export type TypedDatabaseTransaction =
  | LegacyDatabasePayload
  | EIP2930AccessListDatabaseTx;
export type TypedDatabasePayload =
  | LegacyDatabasePayload
  | EIP2930AccessListDatabasePayload;

/**
 * Extra data Ganache stores as part of a transaction in order to support
 * account masquerading and quick lookups for transactions, blocks, and receipts.
 */
export type GanacheRawExtraTx = [
  from: Buffer,
  hash: Buffer,
  blockHash: Buffer,
  blockNumber: Buffer,
  index: Buffer
];

/**
 * Meta data Ganache stores as part of a transaction *in a block*
 */
export type GanacheRawBlockTransactionMetaData = [from: Buffer, hash: Buffer];
