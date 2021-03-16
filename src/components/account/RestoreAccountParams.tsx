import React, {
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Children } from '@components/types';
import { useApi, useChain } from '@components/polkadot/hook';
import { PageFooter } from '@components/common';
import {
  Button,
  Toolbar,
  TextField,
  Container,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
} from '@material-ui/core';
import MenuDownIcon from 'mdi-material-ui/MenuDown';

import { useForm, ErrorOption } from 'react-hook-form';
import { PairType, RestoreSeedType } from './types';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import {
  hdValidatePath,
  keyExtractSuri,
  mnemonicValidate,
} from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';
import {
  RestoreAccountByKeystore,
  RestoreAccountByBipOrRaw,
} from '@components/account';

interface RestoreAccountParamsProps extends Children {}

interface AuthRestoreForm {
  type: RestoreSeedType;
}

// function createByBip(
//   data: AuthRestoreForm,
//   genesisHash: string
// ): UpdatePairResult {
//   if (!data.bip) return {};

//   try {
//     const { valid: seedValid, error: seedError } = seedValidate(
//       data.bip,
//       'bip'
//     );
//     if (!seedValid) return { error: seedError };

//     const { valid: deriveValid, error: deriveError } = deriveValidate(
//       data.bip,
//       'bip',
//       data.derivePath,
//       data.pairType
//     );
//     if (!deriveValid) return { error: deriveError };

//     const pair = keyring.createFromUri(
//       `${data.bip}${data.derivePath}`,
//       { name: data.name, genesisHash },
//       data.pairType === 'ed25519-ledger' ? 'ed25519' : data.pairType
//     );
//     return { pair };
//   } catch (error) {
//     return {
//       error: {
//         name: 'bip',
//         option: {
//           type: 'manual',
//           message: (error as Error).message,
//         },
//       },
//     };
//   }
// }

// function createByRaw(
//   data: AuthRestoreForm,
//   genesisHash: string
// ): UpdatePairResult {
//   if (!data.raw) return {};

//   try {
//     const { valid: seedValid, error: seedError } = seedValidate(
//       data.raw,
//       'raw'
//     );
//     if (!seedValid) return { error: seedError };

//     const { valid: deriveValid, error: deriveError } = deriveValidate(
//       data.raw,
//       'raw',
//       data.derivePath,
//       data.pairType
//     );
//     if (!deriveValid) return { error: deriveError };

//     const pair = keyring.createFromUri(
//       `${data.raw}${data.derivePath}`,
//       { name: data.name, genesisHash },
//       data.pairType === 'ed25519-ledger' ? 'ed25519' : data.pairType
//     );
//     return { pair };
//   } catch (error) {
//     return {
//       error: {
//         name: 'raw',
//         option: {
//           type: 'manual',
//           message: (error as Error).message,
//         },
//       },
//     };
//   }
// }

function RestoreAccountParams({
  children,
}: RestoreAccountParamsProps): ReactElement<RestoreAccountParamsProps> {
  const { register, watch, errors } = useForm<AuthRestoreForm>({
    mode: 'onBlur',
    defaultValues: {
      type: 'keystore',
    },
  });

  const type = useMemo(() => watch('type', 'keystore'), [watch('type')]);

  return (
    <>
      <form>
        <Container>
          <TextField
            name="type"
            label="导入类型"
            inputRef={register({
              required: 'INVALID_TYPE',
              validate: (value: any): value is RestoreSeedType => !!value,
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            select
            SelectProps={{ native: true }}
            error={!!errors.type}
            helperText={errors.type?.message || '导入类型'}
          >
            <option value="keystore">加密 KeyStore(JSON)</option>
            <option value="bip">助记词</option>
            <option value="raw">私钥种子</option>
          </TextField>
        </Container>
      </form>
      {type === 'keystore' ? (
        <RestoreAccountByKeystore />
      ) : (
        <RestoreAccountByBipOrRaw type={type} />
      )}
    </>
  );
}

export default memo(RestoreAccountParams);
