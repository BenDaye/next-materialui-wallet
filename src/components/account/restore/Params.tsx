import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { TextField, Container, Toolbar } from '@material-ui/core';

import { useForm } from 'react-hook-form';
import { RestoreAccountConfirm } from '@components/account';

interface RestoreAccountParamsProps extends BaseProps {}

interface AuthRestoreForm {
  type: 'mnemonic' | 'private_key';
}

function Params({
  children,
}: RestoreAccountParamsProps): ReactElement<RestoreAccountParamsProps> {
  const { register, watch } = useForm<AuthRestoreForm>({
    mode: 'onBlur',
    defaultValues: {
      type: 'mnemonic',
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
          variant="outlined"
          fullWidth
          margin="normal"
          select
          SelectProps={{ native: true }}
          helperText={'导入类型'}
        >
          <option value="mnemonic">助记词</option>
          <option value="private_key">私钥种子</option>
        </TextField>
      </Container>
      <RestoreAccountConfirm type={watch('type')} />
      <Toolbar />
    </>
  );
}

export const RestoreAccountParams = memo(Params);
