import { useContext, useEffect, useState } from 'react';
import { useApi } from '../api/hook';
import { BlockAuthorContext, ValidatorContext } from './context';
import type { BlockAuthorContextProps, ValidatorContextProps } from './types';
import type { VoidFn } from '@polkadot/api/types';
import { useNotice } from '@@/hook';
import { subscribeNewHeads, subscribeValidator } from './helper';
import { useCall } from '@@/hook';
import type { EraRewardPoints } from '@polkadot/types/interfaces';
import { formatNumber } from '@polkadot/util';

export const useBlockAuthor = (): BlockAuthorContextProps =>
  useContext<BlockAuthorContextProps>(BlockAuthorContext);

export const useValidator = (): ValidatorContextProps =>
  useContext<ValidatorContextProps>(ValidatorContext);

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};

export const useBlockAuthorSubscription = (): BlockAuthorContextProps => {
  const { api, isApiReady } = useApi();
  const { showWarning } = useNotice();

  const queryPoints = useCall<EraRewardPoints>(
    api && isApiReady && api.derive.staking?.currentPoints
  );

  const [blockAuthor, setBlockAuthor] = useState<BlockAuthorContextProps>({
    byAuthor: {},
    eraPoints: {},
    lastBlockAuthors: [],
    lastHeaders: [],
  });

  useEffect(() => {
    let unsubscribeNewHeads: VoidFn | null;
    if (!api || !isApiReady) return;

    subscribeNewHeads(api, setBlockAuthor, byAuthor, eraPoints)
      .then((unsubscribe) => (unsubscribeNewHeads = unsubscribe))
      .catch((err: Error) => {
        showWarning(err.message || '区块同步错误');
      });

    return () => {
      unsubscribeNewHeads && unsubscribeNewHeads();
    };
  }, [api, isApiReady]);

  useEffect(() => {
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

  return blockAuthor;
};

export const useValidatorSubscription = (): ValidatorContextProps => {
  const { api, isApiReady } = useApi();
  const { showWarning } = useNotice();

  const [validator, setValidator] = useState<ValidatorContextProps>([]);

  useEffect(() => {
    let unsubscribeValidator: VoidFn | null;
    if (!api || !isApiReady) return;

    subscribeValidator(api, setValidator)
      .then((unsubscribe) => (unsubscribeValidator = unsubscribe))
      .catch((err: Error) => {
        showWarning(err.message || '验证者同步错误');
      });

    return () => {
      unsubscribeValidator && unsubscribeValidator();
    };
  }, [api, isApiReady]);

  return validator;
};
