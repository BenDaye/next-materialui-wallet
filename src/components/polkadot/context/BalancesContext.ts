import { Context, createContext } from 'react';
import { BalancesProps } from './types';

export const BalancesContext: Context<BalancesProps> = createContext<BalancesProps>(
  {
    balances: [],
    // defaultAssetBalance: null,
    urc10ModuleAssetsBalance: [],
  }
);
