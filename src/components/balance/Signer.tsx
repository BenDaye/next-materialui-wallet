import {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Children } from '@components/types';
import {
  useAccounts,
  useApi,
  useIsMountedRef,
} from '@components/polkadot/hook';
import { QueueTx } from '@components/polkadot/context';
import {
  AddressFlags,
  AddressProxy,
  MultiState,
  PasswordState,
  ProxyState,
} from './types';
import { extractExternal, queryForMultisig, queryForProxy } from './util';
import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import Identicon from '@polkadot/react-identicon';

interface SignerProps extends Children {
  currentItem: QueueTx;
  requestAddress: string;
  onChange: (address: AddressProxy) => void;
}

function Signer({
  children,
  requestAddress,
  currentItem,
  onChange,
}: SignerProps): ReactElement<SignerProps> {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const { register, handleSubmit, watch, errors } = useForm();
  const { accounts } = useAccounts();
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

  const _updatePassword = useCallback(
    (signPassword: string, isUnlockCached: boolean) =>
      setSignPassword({ isUnlockCached, signPassword }),
    []
  );

  useEffect(
    () =>
      setSignPassword({
        isUnlockCached: false,
        signPassword: watch('password', ''),
      }),
    [watch('password')]
  );

  useEffect((): void => {
    !proxyInfo && setProxyAddress(null);
  }, [proxyInfo]);

  useEffect((): void => {
    setProxyInfo(null);

    currentItem.extrinsic &&
      queryForProxy(api, accounts, requestAddress, currentItem.extrinsic)
        .then((info) => mountedRef.current && setProxyInfo(info))
        .catch(console.error);
  }, [accounts, api, currentItem, mountedRef, requestAddress]);

  useEffect((): void => {
    setMultiInfo(null);

    currentItem.extrinsic &&
      extractExternal(proxyAddress || requestAddress).isMultisig &&
      queryForMultisig(api, requestAddress, proxyAddress, currentItem.extrinsic)
        .then((info): void => {
          if (mountedRef.current) {
            setMultiInfo(info);
            setIsMultiCall(info?.isMultiCall || false);
          }
        })
        .catch(console.error);
  }, [proxyAddress, api, currentItem, mountedRef, requestAddress]);

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
    <>
      <List disablePadding dense>
        <ListItem disableGutters>
          <ListItemAvatar>
            <Identicon value={requestAddress} size={32} />
          </ListItemAvatar>
          <ListItemText />
        </ListItem>
      </List>
      {signAddress && !currentItem.isUnsigned && flags.isUnlockable && (
        <TextField
          name="password"
          label="密码"
          inputRef={register}
          margin="dense"
          variant="filled"
        />
      )}
      {children}
    </>
  );
}

export default memo(Signer);
