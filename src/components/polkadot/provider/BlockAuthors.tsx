import { Children } from '@components/types';
import {
  Context,
  createContext,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { EraRewardPoints } from '@polkadot/types/interfaces';
import { HeaderExtended } from '@polkadot/api-derive';
import { formatNumber } from '@polkadot/util';
import { useApi } from './Api';
import { useError } from '@components/Error';
import { useCall } from '../hook/useCall';

export interface Authors {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

const MAX_HEADERS = 50;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};
export const BlockAuthorsContext: Context<Authors> = createContext<Authors>({
  byAuthor,
  eraPoints,
  lastBlockAuthors: [],
  lastHeaders: [],
});
export const ValidatorsContext: Context<string[]> = createContext<string[]>([]);

function BlockAuthorsProvider({ children }: Children): ReactElement<Children> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(
    isApiReady && api.derive.staking?.currentPoints
  );
  const [state, setState] = useState<Authors>({
    byAuthor,
    eraPoints,
    lastBlockAuthors: [],
    lastHeaders: [],
  });
  const [validators, setValidators] = useState<string[]>([]);

  const { setError } = useError();

  useEffect(() => {
    if (isApiReady) {
      let lastHeaders: HeaderExtended[] = [];
      let lastBlockAuthors: string[] = [];
      let lastBlockNumber = '';

      // subscribe to all validators
      api.query.session &&
        api.query.session
          .validators((validatorIds): void => {
            setValidators(
              validatorIds.map((validatorId) => validatorId.toString())
            );
          })
          .catch(setError);

      api.derive.chain
        .subscribeNewHeads((lastHeader): void => {
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
        })
        .catch(setError);
    }
  }, [api, isApiReady]);

  useEffect((): void => {
    if (queryPoints) {
      const entries = [
        ...queryPoints.individual.entries(),
      ].map(([accountId, points]) => [
        accountId.toString(),
        formatNumber(points),
      ]);
      const current = Object.keys(eraPoints);

      // we have an update, clear all previous
      if (current.length !== entries.length) {
        current.forEach((accountId): void => {
          delete eraPoints[accountId];
        });
      }

      entries.forEach(([accountId, points]): void => {
        eraPoints[accountId] = points;
      });
    }
  }, [queryPoints]);

  return (
    <ValidatorsContext.Provider value={validators}>
      <BlockAuthorsContext.Provider value={state}>
        {children}
      </BlockAuthorsContext.Provider>
    </ValidatorsContext.Provider>
  );
}

export default memo(BlockAuthorsProvider);

export const useBlockAuthors = (): Authors => useContext(BlockAuthorsContext);
export const useValidators = (): string[] => useContext(ValidatorsContext);
