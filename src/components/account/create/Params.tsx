import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Container,
  createStyles,
  Fade,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import type { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import styles from '@styles/Layout.module.css';
import { Skeleton } from '@material-ui/lab';
import { generateAccount, deriveValidate } from './helper';
import { useForm } from 'react-hook-form';
import { PairType } from '../types';

interface CreateAccountParamsProps extends BaseProps {}

interface ParamsForm {
  pairType: PairType;
  derivePath: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seed: {
      backgroundColor: theme.palette.error.dark,
    },
  })
);

function Params({
  children,
}: CreateAccountParamsProps): ReactElement<CreateAccountParamsProps> | null {
  const { isChainReady } = useChain();
  const {
    step,
    setStep,
    address,
    seed,
    seedType,
    derivePath,
    pairType,
    setAccountProps,
  } = useContext<CreateAccountContextProps>(CreateAccountContext);
  const { showError } = useNotice();
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm<ParamsForm>({
    mode: 'all',
  });

  useEffect(() => {
    if (!seed) {
      setAccountProps(generateAccount(seedType, pairType, derivePath));
    }
  }, [step, seed]);

  const prevStep = useCallback(() => {
    setStep(1);
  }, []);

  const nextStep = useCallback((form: ParamsForm) => {
    setAccountProps({
      address,
      seed,
      seedType,
      pairType: form.pairType,
      derivePath: form.derivePath,
    });
    setStep(3);
  }, []);

  const pairTypeValidate = (value: PairType): true | string => true;

  const derivePathValidate = (value: string): true | string => {
    return deriveValidate(seed, seedType, pairType, value);
  };

  if (!(step === 2 && isChainReady)) return null;

  return (
    <Fade in={step === 2}>
      <Container>
        <form onSubmit={handleSubmit(nextStep)}>
          <Paper>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="备份助记词"
                  secondary="使用纸和笔正确抄写助记词--如果你的手机丢失、被盗、损坏，助记词将可以恢复你的资产。"
                />
              </ListItem>
              <Box px={2} py={1}>
                <Paper variant="outlined" className={classes.seed}>
                  <Box p={1}>
                    <Typography variant="subtitle1">
                      {seed || <Skeleton />}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </List>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<MenuDownIcon />}>
                <Typography>高级选项</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <TextField
                    name="pairType"
                    label="密钥对加密类型"
                    inputRef={register({ validate: pairTypeValidate })}
                    margin="dense"
                    variant="filled"
                    fullWidth
                    defaultValue={pairType}
                    InputLabelProps={{ shrink: true }}
                    helperText="如果你在不同的应用间移动账户，请确保你使用了正确的类型。"
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
                    inputRef={register({ validate: derivePathValidate })}
                    margin="dense"
                    variant="filled"
                    fullWidth
                    defaultValue={derivePath}
                    InputLabelProps={{ shrink: true }}
                    helperText={
                      errors.derivePath?.message ||
                      '派生路径允许你由相同的基础助记词创建不同的账户。'
                    }
                    placeholder="//硬/软///密码"
                    error={!!errors.derivePath}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {children}
          <Toolbar />
          <Toolbar />
          <AppBar
            position="fixed"
            className={styles.bottomNavigation}
            elevation={0}
            color="inherit"
          >
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={prevStep}
              >
                上一步
              </Button>
            </Toolbar>
            <Toolbar>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                type="submit"
              >
                下一步
              </Button>
            </Toolbar>
          </AppBar>
        </form>
      </Container>
    </Fade>
  );
}

export const CreateAccountParams = memo(Params);
