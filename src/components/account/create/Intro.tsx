import React, { memo, ReactElement, useCallback, useContext } from 'react';
import type { BaseProps } from '@@/types';
import {
  AppBar,
  Button,
  Container,
  Fade,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
} from '@material-ui/core';
import { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import styles from '@styles/Layout.module.css';

interface CreateAccountIntroProps extends BaseProps {}

function Intro({
  children,
}: CreateAccountIntroProps): ReactElement<CreateAccountIntroProps> | null {
  const { step, setStep } =
    useContext<CreateAccountContextProps>(CreateAccountContext);

  const nextStep = useCallback(() => {
    setStep(2);
  }, []);

  if (step !== 1) return null;
  return (
    <Fade in={step === 1}>
      <Container>
        <Paper>
          <List dense>
            <ListItem>
              <ListItemText
                primary="备份提示"
                secondary="获得助记词等于拥有钱包资产所有权。"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="备份助记词"
                secondary="使用纸和笔正确抄写助记词--如果你的手机丢失、被盗、损坏助记词将可以恢复你的资产。"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="离线保存"
                secondary="妥善保管至隔离网络的安全地方--请勿将助记词在联网环境下分享和存储，比如邮件、相册、社交应用等。"
              />
            </ListItem>
          </List>
        </Paper>
        {children}
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

export const CreateAccountIntro = memo(Intro);
