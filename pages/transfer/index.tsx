import {
  Box,
  IconButton,
  Container,
  TextField,
  Button,
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import QrcodeScanIcon from 'mdi-material-ui/QrcodeScan';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatBalance } from '@polkadot/util';
import {
  useAccounts,
  useApi,
  useBalances,
  useChain,
  useIsMountedRef,
} from '@components/polkadot/hook';
import { BalanceProps } from '@components/polkadot/context';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { assert } from '@polkadot/util';
import { useQueue } from '@components/polkadot/hook/useQueue';
import { SubmittableResult } from '@polkadot/api';
import ButtonWithLoading from '@components/common/ButtonWithLoading';
import { PageHeader } from '@components/common';

interface TransferFormProps {
  senderId: string;
  recipientId: string;
  symbol: string;
  amount: number;
  keepAlive?: boolean;
  isAll?: boolean;
}

export default function TransferPage() {
  const { api, isApiReady } = useApi();
  const mountedRef = useIsMountedRef();
  const { tokenSymbol } = useChain();
  const { currentAccount, sortedAccounts, setCurrentAccount } = useAccounts();
  const { balances } = useBalances();
  const { queueExtrinsic } = useQueue();
  const [isSending, setIsSending] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    errors,
    clearErrors,
  } = useForm<TransferFormProps>();

  useEffect(() => {
    const senderId = watch('senderId', currentAccount || undefined);
    senderId && setCurrentAccount(senderId);
  }, [mountedRef, watch('senderId')]);

  const AssetBalanceOptions = useMemo(
    () =>
      balances.map((balance, index) => (
        <option key={index} value={balance.symbol}>
          {balance.symbol}
          {balance.balance && `(${balance.balanceFormat})`}
        </option>
      )),
    [mountedRef, balances]
  );

  const theAssetBalance: BalanceProps | undefined = useMemo(
    () => balances.find((b) => b.symbol === watch('symbol')),
    [mountedRef, balances, watch('symbol')]
  );

  const isDefaultAssetBalance: boolean = useMemo(() => {
    if (!watch('symbol')) return true;
    return theAssetBalance ? theAssetBalance.isDefault : true;
  }, [mountedRef, theAssetBalance, watch('symbol')]);

  const formatAmount: string | null = useMemo(() => {
    clearErrors(['amount']);
    const amount = Number(watch('amount', 0));
    if (!amount || !theAssetBalance) return null;
    const { symbol, decimals } = theAssetBalance;
    const withUnit = typeof symbol === 'string' ? symbol : symbol[0];
    const _decimals =
      typeof decimals === 'number'
        ? decimals
        : typeof decimals === 'string'
        ? Number(decimals)
        : Number(decimals[0]);
    return formatBalance(amount, {
      withSiFull: true,
      decimals: _decimals,
      withUnit,
    });
  }, [mountedRef, watch('amount')]);

  const canSubmit: boolean = useMemo(
    () =>
      !!watch('amount') &&
      !!watch('senderId') &&
      !!watch('recipientId') &&
      !!watch('symbol') &&
      !isSending,
    [
      mountedRef,
      watch('amount'),
      watch('senderId'),
      watch('recipientId'),
      watch('symbol'),
      balances,
      isSending,
    ]
  );

  const _onFailed = useCallback(
    (result: SubmittableResult | null) => {
      mountedRef.current && setIsSending(false);
    },
    [mountedRef, setIsSending]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult | null) => {
      mountedRef.current && setIsSending(false);
    },
    [mountedRef, setIsSending]
  );

  const _onStart = useCallback(() => {
    mountedRef.current && setIsSending(true);
  }, [mountedRef, setIsSending]);

  const _onUpdate = useCallback(() => {
    console.log('update');
  }, [mountedRef]);

  const onSubmit = useCallback(
    (data: TransferFormProps) => {
      let extrinsics: SubmittableExtrinsic<'promise'>[] | undefined;

      if (isDefaultAssetBalance) {
        extrinsics = [
          data.keepAlive
            ? api.tx.balances.transferKeepAlive(data.recipientId, data.amount)
            : api.tx.balances.transfer(data.recipientId, data.amount),
        ];
      } else {
        extrinsics = [
          api.tx['urc10Module'].transfer(
            theAssetBalance?.assetId,
            data.recipientId,
            data.amount
          ),
        ];
      }

      assert(extrinsics?.length, 'Expected generated extrinsic');

      extrinsics.forEach((extrinsic) => {
        queueExtrinsic({
          accountId: data.senderId,
          extrinsic,
          isUnsigned: false,
          txFailedCb: _onFailed,
          txStartCb: _onStart,
          txSuccessCb: _onSuccess,
          txUpdateCb: _onUpdate,
        });
      });
    },
    [watch(), isDefaultAssetBalance]
  );

  return (
    <>
      <PageHeader
        title="转账"
        right={
          <IconButton edge="end">
            <QrcodeScanIcon />
          </IconButton>
        }
      />
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            name="senderId"
            label="从此账户发出"
            inputRef={register({ required: true })}
            select
            SelectProps={{
              native: true,
            }}
            variant="filled"
            fullWidth
            defaultValue={currentAccount}
            InputLabelProps={{ shrink: true }}
            helperText="转移的余额将会从发送账户中扣除（以及交易费用）。"
            margin="normal"
          >
            {sortedAccounts.map((account) => (
              <option
                key={account.account.address}
                value={account.account.address}
              >
                {`${account.isDevelopment ? '[TEST] ' : ''}${
                  account.account.meta.name
                }`}
              </option>
            ))}
          </TextField>
          {balances && (
            <TextField
              name="symbol"
              label="资产"
              inputRef={register({ required: true })}
              select
              SelectProps={{
                native: true,
              }}
              variant="filled"
              fullWidth
              defaultValue={tokenSymbol && tokenSymbol[0]}
              InputLabelProps={{ shrink: true }}
              helperText="请确认要转账的资产，每种资产拥有独自的精度。"
              margin="normal"
            >
              {AssetBalanceOptions}
            </TextField>
          )}
          <TextField
            name="recipientId"
            label="转账至此账户"
            inputRef={register({ required: true })}
            select
            SelectProps={{
              native: true,
            }}
            variant="filled"
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText="当交易被包含在区块内后，收款人将可使用已转账的金额。"
            margin="normal"
          >
            {sortedAccounts.map((account) => (
              <option
                key={account.account.address}
                value={account.account.address}
              >
                {`${account.isDevelopment ? '[TEST] ' : ''}${
                  account.account.meta.name
                }`}
              </option>
            ))}
          </TextField>
          {balances && tokenSymbol && (
            <TextField
              name="amount"
              label="转账金额"
              inputRef={register({ required: true, min: 0 })}
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              // autoFocus
              // defaultValue={0}
              error={!!errors.amount}
              helperText={
                errors.amount?.message ||
                formatAmount ||
                '如果接收账户是新的，这个账户的余额就必须多于账户存在所需的押金。同样地，如果发送账户的余额低于同样的值，这个账户就会被移除。'
              }
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {watch('symbol', tokenSymbol[0])}
                  </InputAdornment>
                ),
              }}
              type="number"
            />
          )}
          {isApiReady && (
            <TextField
              name="deposit"
              label="押金"
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              defaultValue={api.consts.balances.existentialDeposit}
              helperText="通过设置[保持账户活跃]选项，可以保护帐户不因余额低而被删除。"
              disabled
              margin="normal"
            />
          )}
          {isDefaultAssetBalance && (
            <Box display="flex" justifyContent="flex-end">
              <FormControlLabel
                label="保持账户活跃"
                labelPlacement="start"
                control={
                  <Switch
                    name="keepAlive"
                    defaultChecked
                    inputRef={register}
                    color="secondary"
                  />
                }
              />
            </Box>
          )}
          {!watch('keepAlive', true) && (
            <Box display="flex" justifyContent="flex-end">
              <FormControlLabel
                label="转移所有资产"
                labelPlacement="start"
                control={
                  <Switch name="isAll" inputRef={register} color="secondary" />
                }
              />
            </Box>
          )}
          <Box mt={4}>
            <ButtonWithLoading loading={isSending}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                type="submit"
                disabled={!canSubmit}
              >
                提交
              </Button>
            </ButtonWithLoading>
          </Box>
        </form>
      </Container>
    </>
  );
}
