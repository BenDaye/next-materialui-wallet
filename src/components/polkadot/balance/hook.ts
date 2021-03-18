import { useSetting } from '@@/hook';
import { useEffect, useMemo, useState } from 'react';
import { useApi } from '../api/hook';
import { useChain } from '../chain/hook';
import { useCall } from '../call/hook';
import type {
  BalanceProps,
  Urc10ModuleAssetResponse,
  Urc10ModuleAsset,
} from './types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { assert, formatBalance } from '@polkadot/util';
import useFetch from 'use-http';
import { useNotice } from '@@/hook';
import type { Codec } from '@polkadot/types/types';
import { createTypeUnsafe } from '@polkadot/types';

export const useBalance = (value: string | null): BalanceProps[] => {
  const defaultAssetBalance = useDefaultAssetBalance(value);
  const fungibleAssetBalance = useFungibleAssetBalance(value);
  const urc10ModuleAssetBalance = useUrc10ModuleAssetBalance(value);

  const balances: BalanceProps[] = useMemo(() => {
    return [
      defaultAssetBalance,
      ...fungibleAssetBalance,
      ...urc10ModuleAssetBalance,
    ] as BalanceProps[];
  }, [defaultAssetBalance, fungibleAssetBalance, urc10ModuleAssetBalance]);

  return balances;
};

export const useDefaultAssetBalance = (value: string | null): BalanceProps => {
  const { api, isApiReady } = useApi();
  const { tokenDecimals, tokenSymbol } = useChain();
  const [balance, setBalance] = useState<BalanceProps>({
    assetId: 'default',
    symbol: tokenSymbol[0],
    decimals: tokenDecimals[0],
    type: 'default',
  });
  const { showError } = useNotice();

  useEffect(() => {
    if (!api || !isApiReady || !value) return;
    getBalance();
  }, [api, isApiReady, value]);

  const getBalance = async () => {
    try {
      assert(api, 'api_required');
      assert(value, 'address_required');
      await api.isReady;

      const result = await api.derive.balances.all(value);

      setBalance({
        assetId: 'default',
        symbol: tokenSymbol[0],
        decimals: tokenDecimals[0],
        type: 'default',
        balance: result?.availableBalance,
        balanceFormat: formatBalance(result?.availableBalance || 0, {
          withSiFull: true,
          withUnit: false,
        }),
      });
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return balance;
};

// TODO: 获取其他资产
export const useFungibleAssetBalance = (
  value: string | null
): BalanceProps[] => {
  return [];
};

export const useUrc10ModuleAssets = (): Urc10ModuleAsset[] => {
  const { node } = useSetting();
  const [assets, setAssets] = useState<Urc10ModuleAsset[]>([]);
  const { error, get, response, abort } = useFetch(
    'http://221.122.102.163:4000'
  );
  const { showWarning } = useNotice();

  useEffect(() => {
    error && showWarning((error as Error).message || 'Urc10Module数据请求失败');
  }, [error]);

  useEffect(() => {
    if (!node) return;
    setAssets([]);
    if (node.name === 'UECC' && node.url === 'ws://221.122.102.163:9944') {
      getAssets();
    }
    return abort;
  }, [node]);

  const getAssets = async (): Promise<void> => {
    try {
      const res: Urc10ModuleAssetResponse = await get('/urc10_assets');

      if (!res) return;

      const { success, result } = res;

      if (response.ok && success) {
        setAssets(result.docs);
      }
    } catch (err) {
      showWarning((err as Error).message);
    }
  };

  return assets;
};

export const useUrc10ModuleAssetBalance = (
  value: string | null
): BalanceProps[] => {
  const { node } = useSetting();
  const { api, isApiReady } = useApi();
  const assets = useUrc10ModuleAssets();
  const [balances, setBalances] = useState<BalanceProps[]>([]);
  const { showError } = useNotice();

  useEffect(() => {
    if (!node) return;
    setBalances([]);
    if (node.name === 'UECC' && node.url === 'ws://221.122.102.163:9944') {
      getBalances();
    }
    return;
  }, [node, api, isApiReady, assets, value]);

  const getBalances = async (): Promise<void> => {
    try {
      assert(api, 'api_required');
      await api.isReady;

      const keys: Codec[] = assets.map((asset: Urc10ModuleAsset) =>
        createTypeUnsafe(api.registry, '(Hash, AccountId)', [
          [asset.assetId, value],
        ])
      );

      const result: Codec[] = await Promise.all(
        keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
      );

      setBalances(
        assets.map(
          (asset: Urc10ModuleAsset, index: number) =>
            ({
              assetId: asset.assetId,
              symbol: asset.symbol,
              decimals: asset.decimals,
              type: 'urc10Module',
              balance: result[index],
              balanceFormat: formatBalance(result[index].toString() || 0, {
                withSiFull: true,
                withUnit: false,
                decimals: asset.decimals,
              }),
            } as BalanceProps)
        )
      );
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return balances;
};
