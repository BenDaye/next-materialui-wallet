import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import {
  PotentialAsset,
  PotentialBalance,
  PotentialBalancesResponse,
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

export function useHttp() {
  const hook = useFetch('http://221.122.102.163:4000');
  const { setError } = useError();
  const { error } = hook;

  useEffect(() => {
    if (error) setError(error);
  }, [error]);

  return hook;
}

export function usePotentialAssets(): Urc10Asset[] {
  const { get, response } = useHttp();
  const [assets, setAssets] = useState<Urc10Asset[]>([]);

  useEffect(() => {
    getAssets();
  }, []);

  async function getAssets() {
    const { success, result }: Urc10AssetResponse = await get(`/urc10_assets`);
    if (response.ok && success) {
      setAssets(result.docs);
    }
  }

  return assets;
}

export function usePotentialAssetsByAddress(address: string | null) {
  const { get, response } = useHttp();
  const [assets, setAssets] = useState<PotentialAsset[]>([]);

  useEffect(() => {
    if (address) getAssets();
  }, [address]);

  async function getAssets() {
    const { success, result }: PotentialBalancesResponse = await get(
      `/potential_balances?account=${address}`
    );
    if (response.ok && success) {
      setAssets(result);
    }
  }

  return assets;
}

export function usePotentialBalances(address: string | null) {
  const { api, isApiReady } = useApi();
  const potentialAssets = usePotentialAssets();
  const [balances, setBalances] = useState<Urc10Balance[]>([]);

  useEffect(() => {
    api && isApiReady && address && getBalances();
  }, [potentialAssets, api, isApiReady, address]);

  async function getBalances() {
    await api.isReady;

    const keys = potentialAssets.map((asset) =>
      createTypeUnsafe(api.registry, '(Hash, AccountId)', [
        [asset.assetId, address],
      ])
    );

    const result: Codec[] = await Promise.all(
      keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
    );

    setBalances(
      potentialAssets.map((asset, index) => ({
        ...asset,
        balance: result[index],
      }))
    );
  }

  return balances;
}

export function usePotentialBalancesByAddress(address: string | null) {
  const { api, isApiReady } = useApi();
  const potentialAssets = usePotentialAssetsByAddress(address);
  const [balances, setBalances] = useState<PotentialBalance[]>([]);

  useEffect(() => {
    api && isApiReady && getBalances();
  }, [potentialAssets, api, isApiReady, address]);

  async function getBalances() {
    await api.isReady;

    const keys = potentialAssets.map((asset) =>
      createTypeUnsafe(api.registry, '(Hash, AccountId)', [
        [asset.assetId, address],
      ])
    );

    const result: Codec[] = await Promise.all(
      keys.map((key) => api.query['urc10Module'].balances(key.toHex()))
    );

    setBalances(
      potentialAssets.map((asset, index) => ({
        ...asset,
        balance: result[index],
      }))
    );
  }

  return balances;
}

export function usePotentialBalance(address: string | null, assetId: string) {
  const { api, isApiReady } = useApi();
  const [balance, setBalance] = useState<Codec>();

  useEffect(() => {
    api && isApiReady && address && assetId && getBalance();
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
}: TransferParams) {
  const { get, response } = useHttp();
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    getTransfers();
    return () => {
      setTransfers([]);
    };
  }, [owner, symbol, counterparty, direction]);

  async function getTransfers() {
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
  }

  return transfers;
}
