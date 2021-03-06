import { Context, createContext } from 'react';
import type { Balance } from '@polkadot/types/interfaces/runtime/types';
import type { Codec } from '@polkadot/types/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Urc10Balance } from '@components/polkadot/hook';

export interface BalancesProps {
  balances: BalanceProps[];
  defaultAssetBalance?: DeriveBalancesAll;
  potentialAssetsBalance: Urc10Balance[];
}

export interface BalanceProps {
  assetId?: string;
  symbol: string | string[];
  isDefault: boolean;
  decimals: string | string[] | number;
  balance?: Balance | Codec;
  balanceFormat?: string;
}

export const BalancesContext: Context<BalancesProps> = createContext<BalancesProps>(
  {
    balances: [],
    // defaultAssetBalance: null,
    potentialAssetsBalance: [],
  }
);
