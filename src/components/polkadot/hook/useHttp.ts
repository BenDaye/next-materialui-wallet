import { useError } from '@components/Error';
import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { useApi } from '../provider';
import {
  PotentialAsset,
  PotentialBalance,
  PotentialBalancesResponse,
} from './types';
import type { Codec } from '@polkadot/types/types';
import { createTypeUnsafe } from '@polkadot/types';
import QueryString from 'query-string';

export function useHttp() {
  const hook = useFetch('http://221.122.102.163:4000');
  const { setError } = useError();
  const { error } = hook;

  useEffect(() => {
    if (error) setError(error);
  }, [error]);

  return hook;
}

interface PotentialAssetsParams {
  address: string | null;
}

interface PotentialBalanceParams extends PotentialAssetsParams {
  assetId: string;
}

export function usePotentialAssets({ address }: PotentialAssetsParams) {
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

export function usePotentialBalances({ address }: PotentialAssetsParams) {
  const { api, isApiReady } = useApi();
  const potentialAssets = usePotentialAssets({ address });
  const [balances, setBalances] = useState<PotentialBalance[]>([]);

  useEffect(() => {
    isApiReady && getBalances();
  }, [potentialAssets, isApiReady]);

  async function getBalances() {
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

export function usePotentialBalance({
  address,
  assetId,
}: PotentialBalanceParams) {
  const { api, isApiReady } = useApi();
  const [balance, setBalance] = useState<Codec>();

  useEffect(() => {
    isApiReady && getBalance();
  }, [address, assetId, isApiReady]);

  async function getBalance() {
    const key = createTypeUnsafe(api.registry, '(Hash, AccountId)', [
      [assetId, address],
    ]);

    const result: Codec = await api.query['urc10Module'].balances(key.toHex());

    setBalance(result);
  }

  return balance;
}

export interface TransferParams {
  owner?: string | null;
  symbol?: string | null;
  counterparty?: string | null;
  direction?: number | null;
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
