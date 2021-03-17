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
  useUrc10ModuleBalances,
} from '@components/polkadot/hook';
import type { Children } from '@components/types';
import { memo, ReactElement, useMemo } from 'react';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatBalance, isFunction } from '@polkadot/util';

function BalancesProvider({ children }: Children): ReactElement<Children> {
  const { api, isApiReady } = useApi();
  const { tokenDecimals, tokenSymbol } = useChain();
  const { currentAccount } = useAccounts();
  const defaultAssetBalance = useCall<DeriveBalancesAll>(
    api &&
      isApiReady &&
      isFunction(api.derive.balances.all) &&
      api.derive.balances.all,
    [currentAccount]
  );

  const urc10ModuleAssetsBalance: Urc10Balance[] = useUrc10ModuleBalances(
    currentAccount
  );

  const value: BalancesProps = useMemo(() => {
    const _defaultBalance: BalanceProps = {
      symbol: tokenSymbol && tokenSymbol[0],
      decimals: tokenDecimals && tokenDecimals[0],
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
    const _urc10ModuleBalances: BalanceProps[] = urc10ModuleAssetsBalance.map(
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
      balances: [_defaultBalance, ..._urc10ModuleBalances],
      defaultAssetBalance,
      urc10ModuleAssetsBalance,
    };
  }, [currentAccount, defaultAssetBalance, urc10ModuleAssetsBalance]);

  return (
    <BalancesContext.Provider value={value}>
      {children}
    </BalancesContext.Provider>
  );
}

export default memo(BalancesProvider);
