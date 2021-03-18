import { ApiPromise } from '@polkadot/api';
import type { VoidFn } from '@polkadot/api/types';
import { assert, isFunction, stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { Dispatch, SetStateAction } from 'react';
import type { EventContextProps, IndexedEvent, KeyedEvent } from './types';

export const MAX_EVENTS = 20;

export const subscribeEvent = async (
  api: ApiPromise,
  setState: Dispatch<SetStateAction<EventContextProps>>
): Promise<VoidFn | null> => {
  assert(api, 'api_required');
  await api.isReady;

  if (!isFunction(api.query.system?.events)) return null;

  let prevBlockHash: string | null = null;
  let prevEventHash: string | null = null;

  return await api.query.system.events((records): void => {
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
    const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

    if (newEventHash !== prevEventHash && newEvents.length) {
      prevEventHash = newEventHash;

      // retrieve the last header, this will map to the current state
      api.rpc.chain.getHeader().then((header): void => {
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
      });
    }
  });
};
