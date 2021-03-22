import React, { memo, ReactElement, useMemo } from 'react';
import type { BaseProps } from '@@/types';
import { TextField, Container, Toolbar } from '@material-ui/core';

import { useForm } from 'react-hook-form';
import type { RestoreSeedType } from './types';
import {
  RestoreAccountByKeystore,
  RestoreAccountByBipOrRaw,
} from '@components/account';

interface RestoreAccountParamsProps extends BaseProps {}

interface AuthRestoreForm {
  type: RestoreSeedType;
}

function Params({
  children,
}: RestoreAccountParamsProps): ReactElement<RestoreAccountParamsProps> {
  const { register, watch } = useForm<AuthRestoreForm>({
    mode: 'onBlur',
    defaultValues: {
      type: 'keystore',
    },
  });

  return (
    <>
      <Container>
        <TextField
          name="type"
          label="导入类型"
          inputRef={register}
          InputLabelProps={{ shrink: true }}
          variant="filled"
          fullWidth
          margin="normal"
          select
          SelectProps={{ native: true }}
          helperText={'导入类型'}
        >
          <option value="keystore">加密 KeyStore(JSON)</option>
          <option value="bip">助记词</option>
          <option value="raw">私钥种子</option>
        </TextField>
      </Container>
      {watch('type', 'keystore') === 'keystore' ? (
        <RestoreAccountByKeystore />
      ) : (
        <RestoreAccountByBipOrRaw type={watch('type')} />
      )}
      <Toolbar />
    </>
  );
}

export const RestoreAccountParams = memo(Params);
