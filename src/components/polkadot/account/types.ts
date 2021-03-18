import { Dispatch, SetStateAction } from 'react';
import type {
  DeriveAccountFlags,
  DeriveAccountRegistration,
} from '@polkadot/api-derive/types';
import type {
  KeyringAddress,
  KeyringJson$Meta,
} from '@polkadot/ui-keyring/types';

export interface AccountState {
  accounts: string[];
  hasAccount: boolean;
  isAccount: (address: string) => boolean;
}

export interface AccountContextProps extends AccountState {
  currentAccount: string | null;
  setCurrentAccount: Dispatch<SetStateAction<string | null>>;
}

export interface AddressFlags extends DeriveAccountFlags {
  isDevelopment: boolean;
  isEditable: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isHardware: boolean;
  isInContacts: boolean;
  isInjected: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isOwned: boolean;
  isValidator: boolean;
  isNominator: boolean;
}

export interface AddressIdentity extends DeriveAccountRegistration {
  isGood: boolean;
  isBad: boolean;
  isKnownGood: boolean;
  isReasonable: boolean;
  isErroneous: boolean;
  isLowQuality: boolean;
  isExistent: boolean;
  waitCount: number;
}

export type AccountTypeInLocal =
  | 'isAccount'
  | 'isAddress'
  | 'isContract'
  | 'unknown';

export interface AccountFullProps {
  accountIndex?: string;
  flags: AddressFlags;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  genesisHash: string | null;
  identity?: AddressIdentity;
  meta?: KeyringJson$Meta;
  isNull: boolean;
  onSaveName: () => void;
  onSaveTags: () => void;
  onSetGenesisHash: (genesisHash: string | null) => void;
  onForget: (cb?: () => void) => void;
  type: AccountTypeInLocal;
}

export interface AccountBaseProps extends KeyringAddress {
  shortAddress: string;
  isDevelopment: boolean;
  name: string;
}
