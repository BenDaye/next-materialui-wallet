import { useCallback, useEffect, useRef, useState } from 'react';
import { MountedRef } from './types';

// NOTE: PolkadotJs
export {
  useAccount,
  useAccountBaseByAddress,
  useAccountFullByAddress,
  useSortedAccounts,
} from './components/polkadot/account/hook';

export {
  useAddress,
  useAddressBaseByAddress,
  useAddressFullByAddress,
  useSortedAddresses,
} from './components/polkadot/address/hook';

export { useApi } from './components/polkadot/api/hook';

export {
  useBalance,
  useFungibleAssetBalance,
  useUrc10ModuleAssetBalance,
  useUrc10ModuleAssets,
} from './components/polkadot/balance/hook';

export { useBlockAuthor, useValidator } from './components/polkadot/block/hook';

export { useChain } from './components/polkadot/chain/hook';

export { useEvent } from './components/polkadot/event/hook';

export { useQueue } from './components/polkadot/queue/hook';

export { useTransfer } from './components/polkadot/transaction/hook';

export { useCall } from './components/polkadot/call/hook';

// NOTE: Common
export { useError } from './components/error/hook';

export { useSetting } from './components/setting/hook';

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
