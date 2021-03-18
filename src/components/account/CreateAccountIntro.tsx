import React, { memo, ReactElement, useCallback } from 'react';
import type { BaseProps } from '@@/types';
import {
  AppBar,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
} from '@material-ui/core';
import styles from '@styles/Layout.module.css';

interface CreateAccountIntroProps extends BaseProps {
  onChangeStep: (step: number) => void;
}

function CreateAccountIntro({
  children,
  onChangeStep,
}: CreateAccountIntroProps): ReactElement<CreateAccountIntroProps> {
  const nextStep = useCallback(() => {
    onChangeStep(2);
  }, []);
  return (
    <>
      <Paper>
        <List dense>
          <ListItem>
            <ListItemText
              primary="备份提示"
              secondary="获得助记词等于拥有钱包资产所有权"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="备份助记词"
              secondary="使用纸和笔正确抄写助记词--如果你的手机丢失、被盗、损坏,助记词将可以恢复你的资产."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="离线保存"
              secondary="妥善保管至隔离网络的安全地方--请勿将助记词在联网环境下分享和存储,比如邮件、相册、社交应用等."
            />
          </ListItem>
        </List>
      </Paper>
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
    </>
  );
}

export default memo(CreateAccountIntro);
