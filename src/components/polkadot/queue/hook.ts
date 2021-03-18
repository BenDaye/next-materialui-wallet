import {
  ActionStatus,
  PartialQueueTxExtrinsic,
  PartialQueueTxRpc,
  QueueContextProps,
  QueueStatus,
  QueueTx,
  QueueTxExtrinsic,
  QueueTxRpc,
  QueueTxStatus,
  SignerCallback,
  STATUS_COMPLETE,
} from './types';
import { useCallback, useContext, useRef, useState } from 'react';
import { QueueContext } from './context';
import { extractEvents, REMOVE_TIMEOUT, SUBMIT_RPC } from './helper';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { SubmittableResult } from '@polkadot/api';

export const useQueue = (): QueueContextProps =>
  useContext<QueueContextProps>(QueueContext);

export const useQueueSubscription = (): QueueContextProps => {
  const [stqueue, _setStQueue] = useState<QueueStatus[]>([]);
  const [txqueue, _setTxQueue] = useState<QueueTx[]>([]);
  const stRef = useRef(stqueue);
  const txRef = useRef(txqueue);

  const setStQueue = useCallback((st: QueueStatus[]): void => {
    stRef.current = st;
    _setStQueue(st);
  }, []);

  const setTxQueue = useCallback((tx: QueueTx[]): void => {
    txRef.current = tx;
    _setTxQueue(tx);
  }, []);

  const addToTxQueue = useCallback(
    (value: QueueTxExtrinsic | QueueTxRpc | QueueTx): void => {
      // const id = ++nextId;
      const id = Date.now();
      const removeItem = () =>
        setTxQueue([
          ...txRef.current.map(
            (item): QueueTx =>
              item.id === id ? { ...item, status: 'completed' } : item
          ),
        ]);

      setTxQueue([
        ...txRef.current,
        {
          ...value,
          id,
          removeItem,
          rpc: (value as QueueTxRpc).rpc || SUBMIT_RPC,
          status: 'queued',
        },
      ]);
    },
    [setTxQueue]
  );

  const queueAction = useCallback(
    (_status: ActionStatus | ActionStatus[]): void => {
      const status = Array.isArray(_status) ? _status : [_status];

      status.length &&
        setStQueue([
          ...stRef.current,
          ...status.map(
            (item): QueueStatus => {
              const id = Date.now();
              const removeItem = (): void =>
                setStQueue([
                  ...stRef.current.filter((item): boolean => item.id !== id),
                ]);

              setTimeout(removeItem, REMOVE_TIMEOUT);

              return {
                ...item,
                id,
                isCompleted: false,
                removeItem,
              };
            }
          ),
        ]);
    },
    [setStQueue]
  );

  const queueExtrinsic = useCallback(
    (value: PartialQueueTxExtrinsic) => addToTxQueue({ ...value }),
    [addToTxQueue]
  );

  const queuePayload = useCallback(
    (
      registry: Registry,
      payload: SignerPayloadJSON,
      signerCb: SignerCallback
    ): void => {
      addToTxQueue({
        accountId: payload.address,
        // this is not great, but the Extrinsic doesn't need a submittable
        extrinsic: (registry.createType(
          'Extrinsic',
          { method: registry.createType('Call', payload.method) },
          { version: payload.version }
        ) as unknown) as SubmittableExtrinsic,
        payload,
        signerCb,
      });
    },
    [addToTxQueue]
  );

  const queueRpc = useCallback(
    (value: PartialQueueTxRpc) => addToTxQueue({ ...value }),
    [addToTxQueue]
  );

  const queueSetTxStatus = useCallback(
    (
      id: number,
      status: QueueTxStatus,
      result?: SubmittableResult,
      error?: Error
    ): void => {
      setTxQueue([
        ...txRef.current.map(
          (item): QueueTx =>
            item.id === id
              ? {
                  ...item,
                  error: error === undefined ? item.error : error,
                  result:
                    result === undefined
                      ? (item.result as SubmittableResult)
                      : result,
                  status: item.status === 'completed' ? item.status : status,
                }
              : item
        ),
      ]);

      queueAction(extractEvents(result));

      if (STATUS_COMPLETE.includes(status)) {
        setTimeout((): void => {
          const item = txRef.current.find((item): boolean => item.id === id);

          item && item.removeItem();
        }, REMOVE_TIMEOUT);
      }
    },
    [queueAction, setTxQueue]
  );

  return {
    stqueue,
    txqueue,
    queueAction,
    queueExtrinsic,
    queuePayload,
    queueRpc,
    queueSetTxStatus,
  };
};
