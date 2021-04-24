import type { Balance } from '@polkadot/types/interfaces/runtime/types';
import type { Codec } from '@polkadot/types/types';

export type BalanceType = 'default' | 'fungible' | 'urc10Module';

export interface BalanceProps {
  assetId: string;
  symbol: string;
  type: BalanceType;
  decimals: number;
  balance?: Balance | Codec;
  balanceFormat?: string;
}

export interface Urc10ModuleAsset {
  assetId: string;
  decimals: number;
  owner: string;
  symbol: string;
  timestamp: number;
  _id: string;
}

export interface Urc10ModuleAssetResponseResultDoc {
  docs: Urc10ModuleAssetResponseResult
}

export interface Urc10ModuleAssetResponseResult {
  count: number;
  docs: Urc10ModuleAsset[];
}

export interface Urc10ModuleAssetResponse {
  success: boolean;
  result: Urc10ModuleAssetResponseResultDoc;
}
