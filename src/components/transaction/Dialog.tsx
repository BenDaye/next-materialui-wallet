import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useApi, useChain, useNotice, useQueue } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  AccountSigner,
  extractCurrent,
  NO_FLAGS,
  sendRpc,
  unlockAccount,
} from './helper';
import { AddressProxy } from './types';
import { NOOP } from '@utils/emptyFunction';
import keyring from '@polkadot/ui-keyring';
import { QueueTxStatus } from '@components/polkadot/queue/types';
import type { SubmittableResult } from '@polkadot/api';
import { delay } from '@utils/delay';
import { ButtonWithLoading } from '@components/common';
import CloseIcon from 'mdi-material-ui/Close';
import { assert } from '@polkadot/util';
import { TransactionContentProvider } from './Content';
import { TransactionSignerProvider } from './Signer';

interface TransactionDialogProps extends BaseProps {}

function TransactionDialog({
  children,
}: TransactionDialogProps): ReactElement<TransactionDialogProps> {
  const { api } = useApi();
  const { isChainReady } = useChain();
  const { showError, showWarning } = useNotice();
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
    assert(senderInfo.signAddress, 'senderInfo[signerAddress]_required');
    if (senderInfo.flags.isUnlockable) {
      unlockAccount(senderInfo);
    } else if (senderInfo.flags.isHardware) {
      // TODO: isHardware
    }
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

    if (!currentItem) {
      setIsSending(false);
      showWarning('currentItem_required');
      return;
    }

    _unlock()
      .then(() => {
        currentItem?.payload ? _onSendPayload() : _onSend();
      })
      .catch((error) => {
        showError((error as Error).message);
        setIsSending(false);
      });
  }, [queueSetTxStatus, currentItem, senderInfo]);

  return (
    <>
      {children}
      <Dialog open={!!currentItem && isVisible} fullScreen scroll="paper">
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
          {!!currentItem && (
            <TransactionContentProvider currentItem={currentItem} />
          )}
          {!!currentItem && requestAddress && (
            <TransactionSignerProvider
              currentItem={currentItem}
              requestAddress={requestAddress}
              onChange={setSenderInfo}
            />
          )}
        </DialogContent>
        <DialogActions>
          <ButtonWithLoading loading={isSending}>
            <Button
              variant="contained"
              autoFocus
              fullWidth
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

export const TransactionDialogProvider = memo(TransactionDialog);
