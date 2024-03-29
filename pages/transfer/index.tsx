import {
  Box,
  IconButton,
  Container,
  TextField,
  Button,
  InputAdornment,
  Switch,
  FormControlLabel,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import ScanHelperIcon from 'mdi-material-ui/ScanHelper';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatBalance } from '@polkadot/util';
import {
  useAccount,
  useAddress,
  useApi,
  useBalance,
  useChain,
  useIsMountedRef,
  useSortedAccounts,
  useSortedAddresses,
} from '@@/hook';
import type { BalanceProps } from '@components/polkadot/balance/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { assert } from '@polkadot/util';
import { useQueue } from '@@/hook';
import { SubmittableResult } from '@polkadot/api';
import ButtonWithLoading from '@components/common/ButtonWithLoading';
import { PageHeader } from '@components/common';
import { Autocomplete } from '@material-ui/lab';

interface TransferFormProps {
  senderId: string;
  symbol: string;
  amount: number;
  keepAlive?: boolean;
  isAll?: boolean;
}

interface RecipientAddress {
  name: string;
  address: string;
  shortAddress: string;
  group: string;
  isDevelopment: boolean;
  disable: boolean;
}

export default function TransferPage() {
  const { api, isApiReady } = useApi();
  const { isChainReady } = useChain();
  const mountedRef = useIsMountedRef();
  const { tokenSymbol } = useChain();
  const { currentAccount, accounts, setCurrentAccount } = useAccount();
  const sortedAccounts = useSortedAccounts(accounts);
  const { addresses } = useAddress();
  const sortedAddresses = useSortedAddresses(addresses);
  const balances = useBalance(currentAccount);
  const { queueExtrinsic } = useQueue();
  const [loading, setLoading] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<RecipientAddress | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    errors,
    getValues,
  } = useForm<TransferFormProps>({
    mode: 'onBlur',
  });

  useEffect(() => {
    const senderId = getValues('senderId');
    senderId && setCurrentAccount(senderId);
  }, [mountedRef, watch('senderId')]);

  const recipientAddresses: RecipientAddress[] = useMemo(
    () => [
      ...sortedAccounts.map(
        ({ name, address, shortAddress, isDevelopment }) => {
          return {
            name,
            address,
            shortAddress,
            group: 'Account',
            isDevelopment,
            disable: address === currentAccount,
          };
        }
      ),
      ...sortedAddresses.map(
        ({ name, address, shortAddress, isDevelopment }) => {
          return {
            name,
            address,
            shortAddress,
            group: 'Address',
            isDevelopment,
            disable: false,
          };
        }
      ),
    ],
    [mountedRef, accounts, addresses, currentAccount]
  );

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
    return theAssetBalance ? theAssetBalance.type === 'default' : true;
  }, [mountedRef, theAssetBalance, watch('symbol')]);

  const formatAmount: string | null = useMemo(() => {
    const amount = Number(getValues('amount'));
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

  const _onFailed = useCallback(
    (result: SubmittableResult | null) => {
      mountedRef.current && setLoading(false);
    },
    [mountedRef, setLoading]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult | null) => {
      mountedRef.current && setLoading(false);
    },
    [mountedRef, setLoading]
  );

  const _onStart = useCallback(() => {
    mountedRef.current && setLoading(true);
  }, [mountedRef, setLoading]);

  const _onUpdate = useCallback(() => {
    // console.log('update');
  }, [mountedRef]);

  const onSubmit = useCallback(
    ({ keepAlive, amount, senderId: accountId }: TransferFormProps) => {
      assert(recipient, 'INVALID_RECIPIENT_ID');
      const recipientId = recipient.address;
      let extrinsics: SubmittableExtrinsic<'promise'>[] | undefined;

      if (isDefaultAssetBalance) {
        extrinsics = [
          keepAlive
            ? api.tx.balances.transferKeepAlive(recipientId, amount)
            : api.tx.balances.transfer(recipientId, amount),
        ];
      } else {
        extrinsics = [
          api.tx['urc10Module'].transfer(
            theAssetBalance?.assetId,
            recipientId,
            amount
          ),
        ];
      }

      assert(extrinsics?.length, 'Expected generated extrinsic');

      extrinsics.forEach((extrinsic) => {
        queueExtrinsic({
          accountId,
          extrinsic,
          isUnsigned: false,
          txFailedCb: _onFailed,
          txStartCb: _onStart,
          txSuccessCb: _onSuccess,
          txUpdateCb: _onUpdate,
        });
      });
    },
    [isDefaultAssetBalance, api, isApiReady, recipient]
  );

  if (!api || !isApiReady || !isChainReady) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <PageHeader
        title="转账"
        right={
          <IconButton edge="end">
            <ScanHelperIcon fontSize="small" />
          </IconButton>
        }
      />
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            name="senderId"
            label="从此账户发出"
            inputRef={register({ required: 'INVALID_SENDER_ID' })}
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
              <option key={account.address} value={account.address}>
                {`${
                  account.isDevelopment ? '[TEST] ' : ''
                }${account.name.toUpperCase()}`}
              </option>
            ))}
          </TextField>
          {balances && (
            <TextField
              name="symbol"
              label="资产"
              inputRef={register({ required: 'SYMBOL_REQUIRED' })}
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
          <Autocomplete
            options={recipientAddresses}
            getOptionLabel={(option) =>
              `${
                option.isDevelopment ? '[TEST] ' : ''
              }${option.name.toUpperCase()} ${option.address}`
            }
            groupBy={(option) => option.group}
            getOptionDisabled={(option) => option.disable}
            freeSolo
            fullWidth
            blurOnSelect
            selectOnFocus
            onChange={(event, newValue: RecipientAddress) => {
              setRecipient(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="recipientIdTest"
                inputRef={register({ required: 'INVALID_RECIPIENT_ID' })}
                label="转账至此账户"
                variant="filled"
                fullWidth
                InputLabelProps={{ shrink: true }}
                helperText="当交易被包含在区块内后，收款人将可使用已转账的金额。"
                margin="normal"
              />
            )}
          />
          {balances && tokenSymbol && (
            <TextField
              name="amount"
              label="转账金额"
              inputRef={register({ required: 'AMOUNT_REQUIRED', min: 0 })}
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              autoFocus
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
            <ButtonWithLoading loading={loading}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                type="submit"
                disabled={loading}
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
