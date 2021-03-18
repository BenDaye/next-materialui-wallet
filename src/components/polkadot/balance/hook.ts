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
  const { node } = useSetting();
  const { api, isApiReady } = useApi();
  const { isChainReady, tokenDecimals, tokenSymbol } = useChain();

  const fungibleAssetBalance = useFungibleAssetBalance(value);
  const urc10ModuleAssetBalance = useUrc10ModuleAssetBalance(value);

  const defaultAssetBalance = useCall<DeriveBalancesAll>(
    api && isApiReady && api.derive.balances?.all,
    [value]
  );

  const balances: BalanceProps[] = useMemo(() => {
    return [
      {
        assetId: 'default',
        symbol: tokenSymbol[0],
        decimals: tokenDecimals[0],
        type: 'default',
        balance: defaultAssetBalance?.availableBalance,
        balanceFormat: formatBalance(
          defaultAssetBalance?.availableBalance || 0,
          {
            withSiFull: true,
            withUnit: false,
          }
        ),
      },
      ...fungibleAssetBalance,
      ...urc10ModuleAssetBalance,
    ] as BalanceProps[];
  }, [defaultAssetBalance, fungibleAssetBalance, urc10ModuleAssetBalance]);

  return balances;
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
      const { success, result }: Urc10ModuleAssetResponse = await get(
        '/urc10_assets'
      );

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
