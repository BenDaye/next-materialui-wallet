import { useChain } from '@@/hook';
import keyring from '@polkadot/ui-keyring';
import { getShortAddress } from '@utils/getShortAddress';
import { useContext } from 'react';
import { AccountBaseProps } from '../account/types';
import { AddressContext } from './context';
import { AddressContextProps } from './types';

export const useAddress = (): AddressContextProps =>
  useContext<AddressContextProps>(AddressContext);

export {
  useAccountBaseByAddress as useAddressBaseByAddress,
  useAccountFullByAddress as useAddressFullByAddress,
} from '../account/hook';

export const getAddress = (value: string | null): AccountBaseProps | null => {
  if (!value) return null;
  try {
    const result = keyring.getAddress(value);
    return result
      ? {
          ...result,
          name: result.meta.name || '<unknown>',
          shortAddress: getShortAddress(result.address),
          isDevelopment: !!result.meta.isTesting,
        }
      : null;
  } catch (error) {
    return null;
  }
};

export const useSortedAddresses = (value: string[]): AccountBaseProps[] => {
  const { isChainReady } = useChain();
  if (!value || !isChainReady) return [];
  return value
    .map((v) => getAddress(v))
    .filter((v): v is AccountBaseProps => !!v)
    .sort((a, b) => (a.meta.whenCreated || 0) - (b.meta.whenCreated || 0));
};
