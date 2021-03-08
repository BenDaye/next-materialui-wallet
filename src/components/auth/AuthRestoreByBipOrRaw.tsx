import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { useApi } from '@components/polkadot/hook';
import { PairType, RestoreSeedType } from './types';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { PageFooter } from '@components/common';
import keyring from '@polkadot/ui-keyring';
import {
  hdValidatePath,
  keyExtractSuri,
  mnemonicValidate,
} from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';

interface AuthRestoreByBipOrRawProps extends Children {
  type: RestoreSeedType;
}

interface AuthRestoreByBipOrRawForm {
  seed: string;
  name: string;
  password: string;
  passwordConfirm: string;
  derivePath: string;
  pairType: PairType;
}

function deriveValidate(
  seed: string,
  seedType: RestoreSeedType,
  derivePath: string = '',
  pairType: PairType = 'sr25519'
): boolean | string {
  try {
    const { password, path } = keyExtractSuri(
      pairType === 'ethereum' ? `${seed}/${derivePath}` : `${seed}${derivePath}`
    );

    if (password?.includes('/')) {
      return 'WARNING_SLASH_PASSWORD';
    }

    if (pairType === 'ed25519' && path.some(({ isSoft }): boolean => isSoft)) {
      return 'SOFT_NOT_ALLOWED';
    }

    if (seedType === 'raw' && password) {
      return 'PASSWORD_IGNORED';
    }

    if (pairType === 'ethereum' && !hdValidatePath(derivePath)) {
      return 'INVALID_DERIVATION_PATH';
    }
    return true;
  } catch (error) {
    console.error(error);
    return (error as Error).message || 'UNEXPECTED_ERROR';
  }
}

function AuthRestoreByBipOrRaw({
  children,
  type,
}: AuthRestoreByBipOrRawProps): ReactElement<AuthRestoreByBipOrRawProps> {
  const { api } = useApi();
  const { register, handleSubmit, watch, errors, getValues } = useForm({
    mode: 'onBlur',
  });

  const onSubmit = (data: AuthRestoreByBipOrRawForm) => console.log(data);

  const onError = (errors: any) => console.error(errors);

  const validSeed = (value: string): boolean | string => {
    switch (type) {
      case 'bip':
        return mnemonicValidate(value) || 'INVALID_SEED';
      case 'raw':
        return (
          (value.length > 0 && value.length <= 32) ||
          (isHex(value) && value.length === 66) ||
          'INVALID_SEED'
        );
      default:
        return 'UNEXPECTED_ERROR';
    }
  };

  const validDerive = (value: string): boolean | string => {
    const { seed, pairType } = getValues(['seed', 'pairType']);
    return deriveValidate(seed, type, value, pairType);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Container>
          <TextField
            name="seed"
            label={type === 'bip' ? '助记词' : '私钥种子'}
            inputRef={register({
              required: 'REQUIRED',
              validate: validSeed,
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            multiline
            rowsMax={5}
            error={!!errors.seed}
            helperText={
              errors.seed?.message ||
              (type === 'bip' ? '用于备份的助记词' : '用于备份的私钥种子')
            }
          />
          <TextField
            name="name"
            label="名称"
            inputRef={register({ required: 'NAME_REQUIRED' })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={
              errors.name?.message ||
              '此账户的名称，以及它会如何出现在你的地址下。拥有一个链上身份，它就可以被他人使用。'
            }
          />
          <TextField
            name="password"
            label="密码"
            inputRef={register({
              required: 'INVALID_PASSWORD',
              validate: (value) =>
                keyring.isPassValid(value) || 'PASSWORD_REQUIRED',
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              '用于此账户的密码和密码确认。当授权任何交易以及加密秘钥对时是必须的。'
            }
          />
          <TextField
            name="passwordConfirm"
            label="确认密码"
            inputRef={register({
              required: 'INVALID_PASSWORD_CONFIRM',
              validate: (value) =>
                keyring.isPassValid(value) || 'PASSWORD_CONFIRM_REQUIRED',
            })}
            InputLabelProps={{ shrink: true }}
            variant="filled"
            fullWidth
            margin="normal"
            type="password"
            error={!!errors.password}
            helperText={
              errors.password?.message ||
              '请确保您使用的是强密码以进行正确的帐户保护。'
            }
          />
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>高级选项</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <TextField
                  name="pairType"
                  label="密钥对加密类型"
                  inputRef={register({
                    required: 'INVALID_PAIR_TYPE',
                    validate: (value: any): value is PairType => !!value,
                  })}
                  margin="dense"
                  variant="filled"
                  fullWidth
                  defaultValue={'sr25519'}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.pairType}
                  helperText={
                    errors.pairType?.message ||
                    '如果你在不同的应用间移动账户，请确保你使用了正确的类型。'
                  }
                  select
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="sr25519">Schnorrkel (sr25519)</option>
                  <option value="ed25519">Edwards (ed25519)</option>
                </TextField>
                <TextField
                  name="derivePath"
                  label="加密派生路径"
                  inputRef={register({
                    validate: validDerive,
                  })}
                  margin="dense"
                  variant="filled"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  placeholder="//硬/软///密码"
                  error={!!errors.derivePath}
                  helperText={
                    errors.derivePath?.message ||
                    '派生路径允许你由相同的基础助记词创建不同的账户。'
                  }
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Container>
        <PageFooter>
          <Toolbar>
            <Button variant="contained" fullWidth color="primary" type="submit">
              导入
            </Button>
          </Toolbar>
        </PageFooter>
      </form>
    </>
  );
}

export default memo(AuthRestoreByBipOrRaw);
