import CloseIcon from 'mdi-material-ui/Close';
import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Children } from '@components/types';
import { useApi } from '@components/polkadot/hook';
import { useQueue } from '@components/polkadot/hook/useQueue';
import { ApiPromise, SubmittableResult } from '@polkadot/api';
import {
  AVAIL_STATUS,
  QueueTx,
  QueueTxMessageSetStatus,
  QueueTxResult,
  QueueTxStatus,
} from '@components/polkadot/context';
import { assert, isFunction } from '@polkadot/util';
import { loggerFormat } from '@polkadot/util/logger';
import type { DefinitionRpcExt } from '@polkadot/types/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Box,
} from '@material-ui/core';
import ButtonWithLoading from '@components/common/ButtonWithLoading';
import { AddressProxy, ItemState } from './types';
import { AccountSigner, NOOP, NO_FLAGS, unlockAccount } from './util';
import { useError } from '@components/error';
import keyring from '@polkadot/ui-keyring';
import { TransactionContent, TransactionSigner } from '.';
import delay from '@utils/delay';

interface TransactionDialogProps extends Children {}

async function submitRpc(
  api: ApiPromise,
  { method, section }: DefinitionRpcExt,
  values: any[]
): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<
      string,
      Record<string, (...params: unknown[]) => Promise<unknown>>
    >;

    assert(
      isFunction(rpc[section] && rpc[section][method]),
      `api.rpc.${section}.${method} does not exist`
    );

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', loggerFormat(result));

    return {
      result,
      status: 'sent',
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      status: 'error',
    };
  }
}

async function sendRpc(
  api: ApiPromise,
  queueSetTxStatus: QueueTxMessageSetStatus,
  { id, rpc, values = [] }: QueueTx
): Promise<void> {
  if (rpc) {
    queueSetTxStatus(id, 'sending');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, result, status } = await submitRpc(api, rpc, values);

    queueSetTxStatus(id, status, result, error);
  }
}

function extractCurrent(txqueue: QueueTx[]): ItemState {
  const available = txqueue.filter(({ status }) =>
    AVAIL_STATUS.includes(status)
  );
  const currentItem = available[0] || null;
  let isRpc = false;
  let isVisible = false;

  if (currentItem) {
    if (
      currentItem.status === 'queued' &&
      !(currentItem.extrinsic || currentItem.payload)
    ) {
      isRpc = true;
    } else if (currentItem.status !== 'signing') {
      isVisible = true;
    }
  }

  return {
    count: available.length,
    currentItem,
    isRpc,
    isVisible,
    requestAddress: (currentItem && currentItem.accountId) || null,
  };
}

function TransactionDialog({
  children,
}: TransactionDialogProps): ReactElement<TransactionDialogProps> {
  const { api } = useApi();
  const { setError } = useError();
  const { queueSetTxStatus, txqueue } = useQueue();
  const [isSending, setIsSending] = useState<boolean>(false);

  const { count, currentItem, isRpc, isVisible, requestAddress } = useMemo(
    () => extractCurrent(txqueue),
    [txqueue]
  );

  const [senderInfo, setSenderInfo] = useState<AddressProxy>({
    isMultiCall: false,
    isUnlockCached: false,
    multiRoot: null,
    proxyRoot: null,
    signAddress: requestAddress,
    signPassword: '',
    flags: NO_FLAGS,
  });

  useEffect((): void => {
    isRpc &&
      currentItem &&
      sendRpc(api, queueSetTxStatus, currentItem).catch(console.error);
  }, [api, isRpc, currentItem, queueSetTxStatus]);

  const _onCancel = useCallback(() => {
    setIsSending(false);
    if (!currentItem) return;
    const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

    queueSetTxStatus(id, 'cancelled');
    signerCb(id, null);
    txFailedCb(null);
  }, [currentItem, queueSetTxStatus]);

  const _unlock = useCallback(async () => {
    // let passwordError: string | null = null;

    if (senderInfo.signAddress) {
      if (senderInfo.flags.isUnlockable) {
        unlockAccount(senderInfo);
      } else if (senderInfo.flags.isHardware) {
        // TODO: isHardware
      }
    }

    // return !passwordError;
  }, [senderInfo]);

  const _onSendPayload = useCallback(() => {
    if (senderInfo.signAddress && currentItem?.payload) {
      const { id, payload, signerCb = NOOP } = currentItem;
      const pair = keyring.getPair(senderInfo.signAddress);
      const result = api
        .createType('ExtrinsicPayload', payload, { version: payload.version })
        .sign(pair);

      signerCb(id, { id, ...result });
      queueSetTxStatus(id, 'completed');
      setIsSending(false);
    }
  }, [queueSetTxStatus, currentItem, senderInfo, api]);

  const _onSend = useCallback(async () => {
    if (senderInfo.signAddress && currentItem?.extrinsic) {
      const {
        id,
        extrinsic,
        txStartCb = NOOP,
        txFailedCb = NOOP,
        txUpdateCb = NOOP,
        txSuccessCb = NOOP,
      } = currentItem;
      const pair = keyring.getPair(senderInfo.signAddress);
      const options = {
        tip: 0,
        nonce: -1,
        signer: new AccountSigner(pair, api.registry),
      };
      queueSetTxStatus(id, 'signing');

      try {
        txStartCb();
        await extrinsic.signAsync(pair, options);
        queueSetTxStatus(id, 'sending');

        const unsubscribe = await extrinsic.send(
          (result: SubmittableResult) => {
            if (!result || !result.status) {
              return;
            }

            const status = result.status.type.toLowerCase() as QueueTxStatus;

            console.log(result?.toHuman());

            queueSetTxStatus(id, status, result);
            txUpdateCb(result);

            if (result.status.isFinalized || result.status.isInBlock) {
              result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }): void => {
                  if (method === 'ExtrinsicFailed') {
                    txFailedCb(result);
                  } else if (method === 'ExtrinsicSuccess') {
                    txSuccessCb(result);
                  }
                });
            } else if (result.isError) {
              txFailedCb(result);
            }

            if (result.isCompleted) {
              unsubscribe();
            }
          }
        );
      } catch (error) {
        queueSetTxStatus(id, 'error', {}, error);
        txFailedCb(error);
      } finally {
        setIsSending(false);
      }
    }
  }, [queueSetTxStatus, currentItem, senderInfo, api]);

  const _onConfirm = useCallback(async () => {
    setIsSending(true);
    await delay();

    _unlock()
      .then(() => {
        currentItem?.payload ? _onSendPayload() : _onSend();
      })
      .catch((error) => {
        setError(error as Error);
        setIsSending(false);
      });
  }, [queueSetTxStatus, currentItem, senderInfo]);

  return (
    <>
      {children}
      <Dialog
        open={!!currentItem && isVisible}
        fullScreen
        aria-labelledby="sign-dialog"
        scroll="paper"
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Box flexGrow={1}>
              <Typography variant="subtitle1">授权</Typography>
            </Box>
            <IconButton edge="end" onClick={_onCancel}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {currentItem && <TransactionContent currentItem={currentItem} />}
          {currentItem && requestAddress && (
            <TransactionSigner
              currentItem={currentItem}
              requestAddress={requestAddress}
              onChange={setSenderInfo}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Box flexGrow={1} />
          <ButtonWithLoading loading={isSending}>
            <Button
              variant="contained"
              autoFocus
              color="secondary"
              disabled={isSending}
              onClick={_onConfirm}
            >
              确认
            </Button>
          </ButtonWithLoading>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(TransactionDialog);
