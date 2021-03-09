import type { Children } from '@components/types';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { EventsContext, EventsProps } from '@components/polkadot/context';
import { useError } from '@components/error';
import { useApi } from '@components/polkadot/hook';
import { VoidFn } from '@polkadot/api/types';
import { subscribeEvents } from '@components/polkadot/utils';

function EventsProvider({ children }: Children): ReactElement<Children> {
  const { api, isApiReady } = useApi();
  const [state, setState] = useState<EventsProps>([]);
  const { setError } = useError();

  useEffect(() => {
    if (!api || !isApiReady) return;

    let unsubscribeEvents: VoidFn | null;

    subscribeEvents(api, setState)
      .then((unsubscribe) => (unsubscribeEvents = unsubscribe))
      .catch(setError);

    return () => {
      unsubscribeEvents && unsubscribeEvents();
    };
  }, [api, isApiReady]);

  return (
    <EventsContext.Provider value={state}>{children}</EventsContext.Provider>
  );
}

export default memo(EventsProvider);
