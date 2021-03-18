import { useNotice } from '@@/hook';
import { useSetting } from '@@/hook';
import { useEffect, useState } from 'react';
import useFetch from 'use-http';
import type {
  GetTransferParams,
  TransferProps,
  TransfersResponse,
} from './types';
import QueryString from 'query-string';

export const useTransfer = ({
  owner = '',
  symbol = '',
  counterparty = '',
  direction,
}: GetTransferParams): TransferProps[] => {
  const { node } = useSetting();
  const [transfers, setTransfers] = useState<TransferProps[]>([]);
  const { error, get, response, abort } = useFetch(
    'http://221.122.102.163:4000'
  );
  const { showWarning } = useNotice();

  useEffect(() => {
    error && showWarning((error as Error).message || 'Urc10Module数据请求失败');
  }, [error]);

  useEffect(() => {
    if (!node) return;
    setTransfers([]);
    if (node.name === 'UECC' && node.url === 'ws://221.122.102.163:9944') {
      getTransfers();
    }
    return abort;
  }, [node]);

  const getTransfers = async (): Promise<void> => {
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
      showWarning((err as Error).message);
    }
  };

  return transfers;
};
