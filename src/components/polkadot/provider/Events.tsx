import type { Children } from '@components/types';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';
import {
  EventsContext,
  EventsProps,
  IndexedEvent,
  KeyedEvent,
} from '@components/polkadot/context';
import { useError } from '@components/error';
import { useApi } from '@components/polkadot/hook';

const MAX_EVENTS = 50;

function EventsProvider({ children }: Children): ReactElement<Children> {
  const { api, isApiReady } = useApi();
  const [state, setState] = useState<EventsProps>([]);
  const { setError } = useError();

  const value = useMemo(() => state, [state]);

  useEffect(() => {
    if (!isApiReady) return;

    let prevBlockHash: string | null = null;
    let prevEventHash: string | null = null;
    // TODO: unsubscribe
    api.query.system
      .events((records): void => {
        const newEvents: IndexedEvent[] = records
          .map((record, index) => ({ indexes: [index], record }))
          .filter(
            ({
              record: {
                event: { method, section },
              },
            }) =>
              section !== 'system' &&
              (method !== 'Deposit' ||
                !['balances', 'treasury'].includes(section)) &&
              (section !== 'inclusion' ||
                !['CandidateBacked', 'CandidateIncluded'].includes(method))
          )
          .reduce((combined: IndexedEvent[], e): IndexedEvent[] => {
            const prev = combined.find(
              ({
                record: {
                  event: { method, section },
                },
              }) =>
                e.record.event.section === section &&
                e.record.event.method === method
            );

            if (prev) {
              prev.indexes.push(...e.indexes);
            } else {
              combined.push(e);
            }

            return combined;
          }, [])
          .reverse();
        const newEventHash = xxhashAsHex(
          stringToU8a(JSON.stringify(newEvents))
        );

        if (newEventHash !== prevEventHash && newEvents.length) {
          prevEventHash = newEventHash;

          // retrieve the last header, this will map to the current state
          api.rpc.chain
            .getHeader()
            .then((header): void => {
              const blockNumber = header.number.unwrap();
              const blockHash = header.hash.toHex();

              if (blockHash !== prevBlockHash) {
                prevBlockHash = blockHash;

                setState((events) =>
                  [
                    ...newEvents.map(
                      ({ indexes, record }): KeyedEvent => ({
                        blockHash,
                        blockNumber,
                        indexes,
                        key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join(
                          '.'
                        )}`,
                        record,
                      })
                    ),
                    // remove all events for the previous same-height blockNumber
                    ...events.filter((p) => !p.blockNumber?.eq(blockNumber)),
                  ].slice(0, MAX_EVENTS)
                );
              }
            })
            .catch(setError);
        }
      })
      .catch(setError);
  }, [api, isApiReady]);

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export default memo(EventsProvider);
