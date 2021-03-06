import type { Children } from '@components/types';
import { memo, ReactElement, useEffect, useState } from 'react';
import type { EraRewardPoints } from '@polkadot/types/interfaces';
import { formatNumber, isFunction } from '@polkadot/util';
import { VoidFn } from '@polkadot/api/types';
import {
  Authors,
  BlockAuthorsContext,
  ValidatorsContext,
} from '@components/polkadot/context';
import { useApi, useCall } from '@components/polkadot/hook';
import { useError } from '@components/error';
import { subscribeNewHeads, subscribeValidator } from './utils';

const MAX_HEADERS = 50;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};

function BlockAuthorsProvider({ children }: Children): ReactElement<Children> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(
    isApiReady &&
      isFunction(api.derive.staking?.currentPoints) &&
      api.derive.staking?.currentPoints
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
    if (!isApiReady) return;

    let unsubscribeValidator: VoidFn | null;
    let unsubscribeNewHeads: VoidFn | null;

    subscribeValidator(api, setValidators)
      .then((unsubscribe) => (unsubscribeValidator = unsubscribe))
      .catch(setError);

    subscribeNewHeads(api, setState, byAuthor, eraPoints, MAX_HEADERS)
      .then((unsubscribe) => (unsubscribeNewHeads = unsubscribe))
      .catch(setError);

    return () => {
      unsubscribeValidator && unsubscribeValidator();
      unsubscribeNewHeads && unsubscribeNewHeads();
    };
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
