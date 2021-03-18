import type {
  ActionStatus,
  ActionStatusPartial,
  QueueContextProps,
  QueueStatus,
  QueueTx,
  StatusCount,
} from './types';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { SubmittableResult } from '@polkadot/api';
import type { DispatchError } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

export const defaultQueue: Partial<QueueContextProps> = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[],
};

export const EVENT_MESSAGE = 'extrinsic event';
export const SUBMIT_RPC = jsonrpc.author.submitAndWatchExtrinsic;
export const REMOVE_TIMEOUT = 7500;

function mergeStatus(status: ActionStatusPartial[]): ActionStatus[] {
  let others: ActionStatus | null = null;

  const initial = status
    .reduce((result: StatusCount[], status): StatusCount[] => {
      const prev = result.find(
        ({ status: prev }) =>
          prev.action === status.action && prev.status === status.status
      );

      if (prev) {
        prev.count++;
      } else {
        result.push({ count: 1, status });
      }

      return result;
    }, [])
    .map(
      ({ count, status }): ActionStatusPartial =>
        count === 1
          ? status
          : { ...status, action: `${status.action} (x${count})` }
    )
    .filter((status): boolean => {
      if (status.message !== EVENT_MESSAGE) {
        return true;
      }

      if (others) {
        if (status.action.startsWith('system.ExtrinsicSuccess')) {
          (others.action as string[]).unshift(status.action);
        } else {
          (others.action as string[]).push(status.action);
        }
      } else {
        others = {
          ...status,
          action: [status.action],
        };
      }

      return false;
    });

  return others ? initial.concat(others) : initial;
}

export const extractEvents = (result?: SubmittableResult): ActionStatus[] => {
  return mergeStatus(
    ((result && result.events) || [])
      // filter events handled globally, or those we are not interested in, these are
      // handled by the global overview, so don't add them here
      .filter(
        (record): boolean =>
          !!record.event && record.event.section !== 'democracy'
      )
      .map(
        ({ event: { data, method, section } }): ActionStatusPartial => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            const [dispatchError] = (data as unknown) as ITuple<
              [DispatchError]
            >;
            let message = dispatchError.type;

            if (dispatchError.isModule) {
              try {
                const mod = dispatchError.asModule;
                const error = dispatchError.registry.findMetaError(mod);

                message = `${error.section}.${error.name}`;
              } catch (error) {
                // swallow
              }
            }

            return {
              action: `${section}.${method}`,
              message,
              status: 'error',
            };
          } else if (section === 'contracts') {
            if (method === 'ContractExecution' && data.length === 2) {
              // see if we have info for this contract
              const [accountId, encoded] = data;
              // TODO: do something
              return {
                action: '[TODO]: decoded.event.identifier',
                message: 'contract event',
                status: 'event',
              };

              // try {
              //   const abi = getContractAbi(accountId.toString());

              //   if (abi) {
              //     const decoded = abi.decodeEvent(encoded as Bytes);

              //     return {
              //       action: decoded.event.identifier,
              //       message: 'contract event',
              //       status: 'event'
              //     };
              //   }
              // } catch (error) {
              //   // ABI mismatch?
              //   console.error(error);
              // }
            } else if (method === 'Evicted') {
              return {
                action: `${section}.${method}`,
                message: 'contract evicted',
                status: 'error',
              };
            }
          }

          return {
            action: `${section}.${method}`,
            message: EVENT_MESSAGE,
            status: 'event',
          };
        }
      )
  );
};
