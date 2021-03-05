import {
  BalanceProps,
  BalancesContext,
  BalancesProps,
} from '@components/polkadot/context';
import {
  useAccounts,
  useApi,
  useIsMountedRef,
  useChain,
  Urc10Balance,
  useCall,
  usePotentialBalances,
} from '@components/polkadot/hook';
import type { Children } from '@components/types';
import { memo, ReactElement, useMemo } from 'react';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';

function BalancesProvider({ children }: Children): ReactElement<Children> {
  const mountedRef = useIsMountedRef();
  const { api, isApiReady } = useApi();
  const { tokenDecimals, tokenSymbol } = useChain();
  const { currentAccount } = useAccounts();
  const defaultAssetBalance = useCall<DeriveBalancesAll>(
    isApiReady && api.derive.balances.all,
    [currentAccount]
  );

  const potentialAssetsBalance: Urc10Balance[] = usePotentialBalances(
    currentAccount
  );

  const value: BalancesProps = useMemo(() => {
    const _defaultBalance: BalanceProps = {
      symbol: tokenSymbol && tokenSymbol[0],
      decimals: tokenDecimals && tokenDecimals[0] && Number(tokenDecimals[0]),
      isDefault: true,
      balance: defaultAssetBalance?.availableBalance,
      balanceFormat:
        defaultAssetBalance &&
        defaultAssetBalance.availableBalance &&
        formatBalance(defaultAssetBalance.availableBalance, {
          withSiFull: true,
          withUnit: false,
        }),
    };
    const _potentialBalances: BalanceProps[] = potentialAssetsBalance.map(
      ({ assetId, symbol, decimals, balance }) => ({
        assetId,
        symbol,
        decimals,
        isDefault: false,
        balance,
        balanceFormat:
          balance &&
          formatBalance(balance.toString(), {
            withSiFull: true,
            withUnit: false,
            decimals,
          }),
      })
    );
    return {
      balances: [_defaultBalance, ..._potentialBalances],
      defaultAssetBalance: defaultAssetBalance || null,
      potentialAssetsBalance,
    };
  }, [mountedRef, currentAccount, defaultAssetBalance, potentialAssetsBalance]);

  return (
    <BalancesContext.Provider value={value}>
      {children}
    </BalancesContext.Provider>
  );
}

export default memo(BalancesProvider);
