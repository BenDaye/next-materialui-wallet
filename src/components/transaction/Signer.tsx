import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useAccount, useApi, useNotice } from '@@/hook';
import { Box, TextField } from '@material-ui/core';
import type { QueueTx } from '@components/polkadot/queue/types';
import type {
  AddressFlags,
  AddressProxy,
  MultiState,
  PasswordState,
  ProxyState,
} from './types';
import { useForm } from 'react-hook-form';
import { AccountInfo } from '@components/account';
import { extractExternal, queryForMultisig, queryForProxy } from './helper';

interface TransactionSignerProps extends BaseProps {
  currentItem: QueueTx;
  requestAddress: string;
  onChange: (address: AddressProxy) => void;
}

function TransactionSigner({
  children,
  requestAddress,
  currentItem,
  onChange,
}: TransactionSignerProps): ReactElement<TransactionSignerProps> {
  const { api } = useApi();
  const { showError } = useNotice();
  const { register } = useForm({ mode: 'all' });
  const { accounts } = useAccount();
  const [multiAddress, setMultiAddress] = useState<string | null>(null);
  const [proxyAddress, setProxyAddress] = useState<string | null>(null);
  const [isMultiCall, setIsMultiCall] = useState(false);
  const [isProxyActive, setIsProxyActive] = useState(true);
  const [multiInfo, setMultiInfo] = useState<MultiState | null>(null);
  const [proxyInfo, setProxyInfo] = useState<ProxyState | null>(null);
  const [
    { isUnlockCached, signPassword },
    setSignPassword,
  ] = useState<PasswordState>({ isUnlockCached: false, signPassword: '' });

  const [signAddress, flags] = useMemo((): [string, AddressFlags] => {
    const signAddress =
      (multiInfo && multiAddress) ||
      (isProxyActive && proxyInfo && proxyAddress) ||
      requestAddress;

    return [signAddress, extractExternal(signAddress)];
  }, [
    multiAddress,
    proxyAddress,
    isProxyActive,
    multiInfo,
    proxyInfo,
    requestAddress,
  ]);

  const passwordValidate = (value: string): boolean | string => {
    setSignPassword({ isUnlockCached: false, signPassword: value });
    return true;
  };

  useEffect((): void => {
    !proxyInfo && setProxyAddress(null);
  }, [proxyInfo]);

  useEffect((): void => {
    setProxyInfo(null);

    currentItem.extrinsic &&
      queryForProxy(api, accounts, requestAddress, currentItem.extrinsic)
        .then((info) => setProxyInfo(info))
        .catch(console.error);
  }, [accounts, api, currentItem, requestAddress]);

  useEffect((): void => {
    setMultiInfo(null);

    currentItem.extrinsic &&
      extractExternal(proxyAddress || requestAddress).isMultisig &&
      queryForMultisig(api, requestAddress, proxyAddress, currentItem.extrinsic)
        .then((info): void => {
          setMultiInfo(info);
          setIsMultiCall(info?.isMultiCall || false);
        })
        .catch(console.error);
  }, [proxyAddress, api, currentItem, requestAddress]);

  useEffect((): void => {
    onChange({
      isMultiCall,
      isUnlockCached,
      multiRoot: multiInfo ? multiInfo.address : null,
      proxyRoot: proxyInfo && isProxyActive ? proxyInfo.address : null,
      signAddress,
      signPassword,
      flags,
    });
  }, [
    isProxyActive,
    isMultiCall,
    isUnlockCached,
    multiAddress,
    multiInfo,
    onChange,
    proxyAddress,
    proxyInfo,
    signAddress,
    signPassword,
    flags,
  ]);

  return (
    <Box>
      <Box mt={1}>
        <AccountInfo value={requestAddress} dense />
      </Box>
      {signAddress && !currentItem.isUnsigned && flags.isUnlockable && (
        <TextField
          name="password"
          label="密码"
          inputRef={register({ validate: passwordValidate })}
          margin="dense"
          variant="filled"
          fullWidth
          type="password"
        />
      )}
      {children}
    </Box>
  );
}

export const TransactionSignerProvider = memo(TransactionSigner);
