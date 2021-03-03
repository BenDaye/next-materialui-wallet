import { BalancesContext, BalancesProps } from '@components/polkadot/context';
import { useContext } from 'react';

export const useBalances = (): BalancesProps => useContext(BalancesContext);
