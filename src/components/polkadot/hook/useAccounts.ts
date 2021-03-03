import { useContext } from 'react';
import { AccountsContext, AccountsProps } from '@components/polkadot/context';

export const useAccounts = (): AccountsProps => useContext(AccountsContext);
