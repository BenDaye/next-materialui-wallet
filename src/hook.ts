import { useCallback, useEffect, useRef, useState } from 'react';
import { MountedRef } from './types';

// NOTE: Third party
export { default as useCopy } from '@react-hook/copy';

// NOTE: Logic
export {
  useAccounts,
  useAccount,
  useCurrentAccount,
  useAccountsByType,
  useMnemonic,
  useAddressByMnemonic,
  useAddressByPrivateKey,
} from './components/php/account/hook';

export { useAddresses, useAddress } from './components/php/address/hook';

export { useChain, useCurrentChain } from './components/php/chain/hook';

export { useBalance } from './components/php/balance/hook';

// NOTE: Common
export { useError } from './components/error/hook';

export { useNotice } from './components/notice/hook';

export const useIsMountedRef = (): MountedRef => {
  const isMounted = useRef(false);

  useEffect((): (() => void) => {
    isMounted.current = true;

    return (): void => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

export const useToggle = (
  defaultValue = false,
  onToggle?: (isActive: boolean) => void
): [boolean, () => void, (value: boolean) => void] => {
  const mountedRef = useIsMountedRef();
  const [isActive, setActive] = useState<boolean>(defaultValue);

  const _toggleActive = useCallback((): void => {
    mountedRef.current && setActive((isActive) => !isActive);
  }, [mountedRef]);

  const _setActive = useCallback(
    (isActive: boolean): void => {
      mountedRef.current && setActive(isActive);
    },
    [mountedRef]
  );

  useEffect(() => onToggle && onToggle(isActive), [isActive, onToggle]);

  return [isActive, _toggleActive, _setActive];
};

export const useDebug = (): boolean =>
  process.env.NODE_ENV === 'development' || !!process.env.DEBUG;
