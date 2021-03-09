import { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccounts, useAddresses, useApi, useCall, useToggle } from '.';
import {
  AccountTypeInLocal,
  AddressFlags,
  AddressIdentity,
  UseAccountInfo,
} from './types';
import type {
  DeriveAccountFlags,
  DeriveAccountInfo,
} from '@polkadot/api-derive/types';
import type { Nominations, ValidatorPrefs } from '@polkadot/types/interfaces';
import { isFunction } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import { useError } from '@components/error';

const IS_NONE = {
  isCouncil: false,
  isDevelopment: false,
  isEditable: false,
  isExternal: false,
  isFavorite: false,
  isHardware: false,
  isInContacts: false,
  isInjected: false,
  isMultisig: false,
  isNominator: false,
  isOwned: false,
  isProxied: false,
  isSociety: false,
  isSudo: false,
  isTechCommittee: false,
  isValidator: false,
};

export function useAccountInfo(value: string | null): UseAccountInfo {
  const { api, isApiReady } = useApi();
  const { setError } = useError();
  const { isAccount } = useAccounts();
  const { isAddress } = useAddresses();

  const accountInfo = useCall<DeriveAccountInfo>(
    api && isApiReady && api.derive.accounts.info,
    [value]
  );
  const accountFlags = useCall<DeriveAccountFlags>(
    api && isApiReady && api.derive.accounts.flags,
    [value]
  );
  const nominator = useCall<Nominations>(
    api && isApiReady && api.query.staking?.nominators,
    [value]
  );
  const validator = useCall<ValidatorPrefs>(
    api && isApiReady && api.query.staking?.validators,
    [value]
  );

  const [accountIndex, setAccountIndex] = useState<string | undefined>(
    undefined
  );
  const [tags, setSortedTags] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [identity, setIdentity] = useState<AddressIdentity | undefined>();
  const [flags, setFlags] = useState<AddressFlags>(IS_NONE);
  const [meta, setMeta] = useState<KeyringJson$Meta | undefined>();

  useEffect((): void => {
    validator &&
      setFlags((flags) => ({
        ...flags,
        isValidator: !validator.isEmpty,
      }));
  }, [validator]);

  useEffect((): void => {
    nominator &&
      setFlags((flags) => ({
        ...flags,
        isNominator: !nominator.isEmpty,
      }));
  }, [nominator]);

  useEffect((): void => {
    accountFlags &&
      setFlags((flags) => ({
        ...flags,
        ...accountFlags,
      }));
  }, [accountFlags]);

  useEffect((): void => {
    const { accountIndex, identity, nickname } = accountInfo || {};
    const newIndex = accountIndex?.toString();

    setAccountIndex((oldIndex) =>
      oldIndex !== newIndex ? newIndex : oldIndex
    );

    let name;

    if (api && isApiReady && isFunction(api.query.identity?.identityOf)) {
      if (identity?.display) {
        name = identity.display;
      }
    } else if (nickname) {
      name = nickname;
    }

    setName(name || '');

    if (identity) {
      const judgements = identity.judgements.filter(
        ([, judgement]) => !judgement.isFeePaid
      );
      const isKnownGood = judgements.some(
        ([, judgement]) => judgement.isKnownGood
      );
      const isReasonable = judgements.some(
        ([, judgement]) => judgement.isReasonable
      );
      const isErroneous = judgements.some(
        ([, judgement]) => judgement.isErroneous
      );
      const isLowQuality = judgements.some(
        ([, judgement]) => judgement.isLowQuality
      );

      setIdentity({
        ...identity,
        isBad: isErroneous || isLowQuality,
        isErroneous,
        isExistent: !!identity.display,
        isGood: isKnownGood || isReasonable,
        isKnownGood,
        isLowQuality,
        isReasonable,
        judgements,
        waitCount: identity.judgements.length - judgements.length,
      });
    } else {
      setIdentity(undefined);
    }
  }, [accountInfo, api, isApiReady]);

  const type: AccountTypeInLocal = useMemo(() => {
    if (!value) return 'unknown';
    try {
      return isAccount(value)
        ? 'isAccount'
        : isAddress(value)
        ? 'isAddress'
        : 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }, [value, isAccount, isAddress]);

  useEffect((): void => {
    if (!value) return;
    try {
      const accountOrAddress =
        keyring.getAccount(value) || keyring.getAddress(value);
      const isOwned = isAccount(value);
      const isInContacts = isAddress(value);

      setGenesisHash(accountOrAddress?.meta.genesisHash || null);
      setFlags(
        (flags): AddressFlags => ({
          ...flags,
          isDevelopment: accountOrAddress?.meta.isTesting || false,
          isEditable:
            !!(
              !identity?.display &&
              (isInContacts ||
                accountOrAddress?.meta.isMultisig ||
                (accountOrAddress && !accountOrAddress.meta.isInjected))
            ) || false,
          isExternal: !!accountOrAddress?.meta.isExternal || false,
          isHardware: !!accountOrAddress?.meta.isHardware || false,
          isInContacts,
          isInjected: !!accountOrAddress?.meta.isInjected || false,
          isMultisig: !!accountOrAddress?.meta.isMultisig || false,
          isOwned,
          isProxied: !!accountOrAddress?.meta.isProxied || false,
        })
      );
      setMeta(accountOrAddress?.meta);
      setName(accountOrAddress?.meta.name || '');
      setSortedTags(
        accountOrAddress?.meta.tags
          ? (accountOrAddress.meta.tags as string[]).sort()
          : []
      );
    } catch (error) {
      // ignore
    }
  }, [identity, isAccount, isAddress, value]);

  const onSaveName = useCallback((): void => {
    if (!value) return;
    const meta = { name, whenEdited: Date.now() };

    try {
      switch (type) {
        case 'isAccount': {
          const pair = keyring.getPair(value);
          pair && keyring.saveAccountMeta(pair, meta);
          break;
        }
        case 'isAddress': {
          const pair = keyring.getAddress(value);
          pair
            ? keyring.saveAddress(value, meta)
            : keyring.saveAddress(value, { genesisHash, ...meta });
          break;
        }
        // case 'isContract': {
        //   const originalMeta = keyring.getAddress(value)?.meta;
        //   keyring.saveContract(value, { ...originalMeta, ...meta });
        // break;
        // }
        default:
          break;
      }
    } catch (error) {
      setError(error);
    }
  }, [api, type, name, value]);

  const onSaveTags = useCallback((): void => {
    if (!value) return;
    const meta = { tags, whenEdited: Date.now() };

    try {
      switch (type) {
        case 'isAccount': {
          const pair = keyring.getPair(value);
          pair && keyring.saveAccountMeta(pair, meta);
          break;
        }
        case 'isAddress': {
          const pair = keyring.getAddress(value);
          pair
            ? keyring.saveAddress(value, meta)
            : keyring.saveAddress(value, { genesisHash, ...meta });
          break;
        }
        // case 'isContract': {
        //   const originalMeta = keyring.getAddress(value)?.meta;
        //   keyring.saveContract(value, { ...originalMeta, ...meta });
        // break;
        // }
        default:
          break;
      }
    } catch (error) {
      setError(error);
    }
  }, [api, type, tags, value]);

  const onForget = useCallback(
    (cb?: () => void): void => {
      if (!value) return;

      try {
        switch (type) {
          case 'isAccount': {
            keyring.forgetAccount(value);
            break;
          }
          case 'isAddress': {
            keyring.forgetAddress(value);
            break;
          }
          // case 'isContract': {
          // keyring.forgetContract(value);
          // break;
          // }
          default:
            break;
        }
        cb && cb();
      } catch (error) {
        setError(error);
      }
    },
    [api, value, type]
  );

  const setTags = useCallback(
    (values: string[]) => setSortedTags(values.sort()),
    []
  );

  const onSetGenesisHash = useCallback(
    (genesisHash: string | null): void => {
      if (value) {
        const account = keyring.getPair(value);

        account &&
          keyring.saveAccountMeta(account, { ...account.meta, genesisHash });

        setGenesisHash(genesisHash);
      }
    },
    [value]
  );

  return {
    accountIndex,
    flags,
    genesisHash,
    identity,
    isNull: !value,
    meta,
    name,
    onForget,
    onSaveName,
    onSaveTags,
    onSetGenesisHash,
    setName,
    setTags,
    tags,
    type,
  };
}
