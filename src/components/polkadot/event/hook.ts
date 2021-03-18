import { EventContext } from './context';
import type { EventContextProps } from './types';
import { useContext, useEffect, useState } from 'react';
import { useApi } from '../api/hook';
import { useNotice } from '@@/hook';
import { VoidFn } from '@polkadot/api/types';
import { subscribeEvent } from './helper';

export const useEvent = (): EventContextProps =>
  useContext<EventContextProps>(EventContext);

export const useEventSubscription = (): EventContextProps => {
  const { api, isApiReady } = useApi();
  const { showWarning } = useNotice();

  const [event, setEvent] = useState<EventContextProps>([]);

  useEffect(() => {
    let unsubscribeEvent: VoidFn | null;
    if (!api || !isApiReady) return;

    subscribeEvent(api, setEvent)
      .then((unsubscribe) => (unsubscribeEvent = unsubscribe))
      .catch((err: Error) => {
        showWarning(err.message || '事件同步错误');
      });

    return () => {
      unsubscribeEvent && unsubscribeEvent();
    };
  }, [api, isApiReady]);

  return event;
};
