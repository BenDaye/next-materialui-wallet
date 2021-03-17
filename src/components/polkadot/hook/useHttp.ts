import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import {
  Urc10ModuleAsset,
  Urc10ModuleBalance,
  Urc10ModuleBalancesResponse,
  TransferParams,
  Urc10Asset,
  Urc10AssetResponse,
  Urc10Balance,
} from './types';
import type { Codec } from '@polkadot/types/types';
import { createTypeUnsafe } from '@polkadot/types';
import QueryString from 'query-string';
import { useError } from '@components/error';
import { useApi } from './useApi';
import { useSetting } from '@components/common/Setting';
import { useNotice } from '@components/common';

export function useHttp() {
  const hook = useFetch('http://221.122.102.163:4000');
  const { setError } = useError();
  const { error } = hook;

  useEffect(() => {
    if (error) setError(error);
  }, [error]);

  return hook;
}

export function useUrc10ModuleAssets(): Urc10Asset[] {
  const { node } = useSetting();
  const { get, response } = useHttp();
  const [assets, setAssets] = useState<Urc10Asset[]>([]);
  const { showError } = useNotice();

  useEffect(() => {
    setAssets([]);
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      getAssets();
    }
  }, [node]);

  async function getAssets() {
    try {
      const { success, result }: Urc10AssetResponse = await get(
        `/urc10_assets`
      );
      if (response.ok && success) {
        setAssets(result.docs);
      }
    } catch (err) {
      showError((err as Error).message);
    }
  }

  return assets;
}

export function useUrc10ModuleAssetsByAddress(
  address: string | null
): Urc10ModuleAsset[] {
  const { node } = useSetting();
  const { get, response } = useHttp();
  const [assets, setAssets] = useState<Urc10ModuleAsset[]>([]);
  const { showError } = useNotice();

  useEffect(() => {
    setAssets([]);
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      if (address) getAssets();
    }
  }, [address]);

  async function getAssets() {
    try {
      const { success, result }: Urc10ModuleBalancesResponse = await get(
        `/potential_balances?account=${address}`
      );
      if (response.ok && success) {
        setAssets(result);
      }
    } catch (err) {
      showError((err as Error).message);
    }
  }

  return assets;
}

export function useUrc10ModuleBalances(address: string | null): Urc10Balance[] {
  const { node } = useSetting();
  const { api, isApiReady } = useApi();
  const urc10ModuleAssets = useUrc10ModuleAssets();
  const [balances, setBalances] = useState<Urc10Balance[]>([]);

  useEffect(() => {
    setBalances([]);
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      api && isApiReady && address && getBalances();
    }
  }, [urc10ModuleAssets, api, isApiReady, address]);

  async function getBalances() {
    await api.isReady;

    const keys = urc10ModuleAssets.map((asset) =>
      createTypeUnsafe(api.registry, '(Hash, AccountId)', [
        [asset.assetId, address],
      ])
    );

    const result: Codec[] = await Promise.all(
      keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
    );

    setBalances(
      urc10ModuleAssets.map((asset, index) => ({
        ...asset,
        balance: result[index],
      }))
    );
  }

  return balances;
}

export function useUrc10ModuleBalancesByAddress(
  address: string | null
): Urc10ModuleBalance[] {
  const { node } = useSetting();
  const { api, isApiReady } = useApi();
  const urc10ModuleAssets = useUrc10ModuleAssetsByAddress(address);
  const [balances, setBalances] = useState<Urc10ModuleBalance[]>([]);

  useEffect(() => {
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      api && isApiReady && getBalances();
    }
  }, [urc10ModuleAssets, api, isApiReady, address]);

  async function getBalances() {
    await api.isReady;

    const keys = urc10ModuleAssets.map((asset) =>
      createTypeUnsafe(api.registry, '(Hash, AccountId)', [
        [asset.assetId, address],
      ])
    );

    const result: Codec[] = await Promise.all(
      keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
    );

    setBalances(
      urc10ModuleAssets.map((asset, index) => ({
        ...asset,
        balance: result[index],
      }))
    );
  }

  return balances;
}

export function useUrc10ModuleBalance(
  address: string | null,
  assetId: string
): Codec | null {
  const { node } = useSetting();
  const { api, isApiReady } = useApi();
  const [balance, setBalance] = useState<Codec | null>(null);

  useEffect(() => {
    setBalance(null);
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      api && isApiReady && address && assetId && getBalance();
    }
  }, [address, assetId, api, isApiReady]);

  async function getBalance() {
    await api.isReady;

    const key = createTypeUnsafe(api.registry, '(Hash, AccountId)', [
      [assetId, address],
    ]);

    const result: Codec = await api.query['urc10Module'].balances(key.toHex());

    setBalance(result);
  }

  return balance;
}

interface TransfersResponse {
  success: boolean;
  result: TransfersResponseResult;
}

interface TransfersResponseResult {
  count: number;
  docs: Transfer[];
}

interface Transfer {
  owner: string; // "5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAe",
  counterparty: string; // "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  direction: number; // 1: out, 2: in,
  amount: string; // "200000000000",
  exHash: string; // "0xa2048b990e50b163e2069d07a182741a83a6ed395655da367cde1222390d520a",
  blockNumber: number; // 12,
  type: string; // "native",
  symbol: string; // "UECC",
  _id: string; // "ZFay5oqAVg3xyywH",
}

export function useTransfers({
  owner = '',
  symbol = '',
  counterparty = '',
  direction,
}: TransferParams): Transfer[] {
  const { node } = useSetting();
  const { get, response } = useHttp();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const { showError } = useNotice();

  useEffect(() => {
    setTransfers([]);
    if (node.name === 'UECC' || node.url === 'ws://221.122.102.163:9944') {
      !!get && getTransfers();
    }
  }, [owner, symbol, counterparty, direction, get]);

  async function getTransfers() {
    try {
      // TODO: 翻页
      const params = QueryString.stringify(
        { owner, symbol, counterparty, direction, limit: 1000 },
        { skipEmptyString: true, skipNull: true }
      );
      const { success, result }: TransfersResponse = await get(
        `/transfers?${params}`
      );
      if (response.ok && success) {
        setTransfers(result.docs);
      }
    } catch (err) {
      showError((err as Error).message);
    }
  }

  return transfers;
}
