import React, { memo, ReactElement, useCallback, useContext } from 'react';
import type { BaseProps } from '@@/types';
import { useNotice } from '@@/hook';
import {
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
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import type { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import styles from '@styles/Layout.module.css';
import { Skeleton } from '@material-ui/lab';

interface CreateAccountParamsProps extends BaseProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mnemonic: {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.primary.main,
    },
  })
);

function Params({
  children,
}: CreateAccountParamsProps): ReactElement<CreateAccountParamsProps> | null {
  const { step, setStep, mnemonic } =
    useContext<CreateAccountContextProps>(CreateAccountContext);
  const { showError } = useNotice();
  const classes = useStyles();

  const prevStep = useCallback(() => {
    setStep(1);
  }, []);

  const nextStep = useCallback(() => {
    setStep(3);
  }, []);

  if (step !== 2) return null;

  return (
    <Fade in={step === 2}>
      <Container>
        <Paper>
          <List dense>
            <ListItem>
              <ListItemText
                primary="备份助记词"
                secondary="使用纸和笔正确抄写助记词--如果你的手机丢失、被盗、损坏，助记词将可以恢复你的资产。"
              />
            </ListItem>
            <Box px={2} py={1}>
              <Paper variant="outlined" className={classes.mnemonic}>
                <Box p={1}>
                  <Typography variant="subtitle1">
                    {mnemonic || <Skeleton />}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </List>
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
              onClick={nextStep}
            >
              下一步
            </Button>
          </Toolbar>
        </AppBar>
      </Container>
    </Fade>
  );
}

export const CreateAccountParams = memo(Params);
