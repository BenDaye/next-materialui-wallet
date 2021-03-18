import { ApiPromise } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { assert, formatNumber, isFunction } from '@polkadot/util';
import { Dispatch, SetStateAction } from 'react';
import { BlockAuthorContextProps } from './types';
import { HeaderExtended } from '@polkadot/api-derive';

export const MAX_HEADERS = 20;

export const subscribeNewHeads = async (
  api: ApiPromise,
  setState: Dispatch<SetStateAction<BlockAuthorContextProps>>,
  byAuthor: Record<string, string>,
  eraPoints: Record<string, string>
): Promise<VoidFn | null> => {
  assert(api, 'api_required');
  await api.isReady;

  if (!isFunction(api.derive.chain.subscribeNewHeads)) return null;

  let lastHeaders: HeaderExtended[] = [];
  let lastBlockAuthors: string[] = [];
  let lastBlockNumber = '';

  return await api.derive.chain.subscribeNewHeads((lastHeader): void => {
    if (lastHeader?.number) {
      const blockNumber = lastHeader.number.unwrap();
      const thisBlockAuthor =
        lastHeader.author?.toString() || `<unknown>:${Date.now()}`;
      const thisBlockNumber = formatNumber(blockNumber);

      if (thisBlockAuthor) {
        byAuthor[thisBlockAuthor] = thisBlockNumber;

        if (thisBlockNumber !== lastBlockNumber) {
          lastBlockNumber = thisBlockNumber;
          lastBlockAuthors = [thisBlockAuthor];
        } else {
          lastBlockAuthors.push(thisBlockAuthor);
        }
      }

      lastHeaders = lastHeaders
        .filter(
          (old, index) =>
            index < MAX_HEADERS && old.number.unwrap().lt(blockNumber)
        )
        .reduce(
          (next, header): HeaderExtended[] => {
            next.push(header);
            return next;
          },
          [lastHeader]
        )
        .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

      setState({
        byAuthor,
        eraPoints,
        lastBlockAuthors: lastBlockAuthors.slice(),
        lastBlockNumber,
        lastHeader,
        lastHeaders,
      });
    }
  });
};

export const subscribeValidator = async (
  api: ApiPromise,
  setState: Dispatch<SetStateAction<string[]>>
): Promise<VoidFn | null> => {
  assert(api, 'api_required');
  await api.isReady;

  if (!isFunction(api.query.session?.validators)) return null;

  return await api.query.session.validators((validatorIds): void => {
    setState(validatorIds.map((validatorId) => validatorId.toString()));
  });
};
