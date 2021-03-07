import React, {
  ChangeEvent,
  Dispatch,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { Children } from '@components/types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Skeleton } from '@material-ui/lab';
import { useForm } from 'react-hook-form';
import { AddressState, AuthCreateParamsCallback } from './types';
import styles from '@styles/Layout.module.css';

interface AuthCreateParamsProps extends Children {
  alert: {
    showScreenShootAlert: boolean;
    setShowScreenShootAlert: React.Dispatch<React.SetStateAction<boolean>>;
  };
  params: AddressState;
  onChange: (params: AuthCreateParamsCallback) => void;
  onChangeStep: (step: number) => void;
}

function AuthCreateParams({
  children,
  alert: { showScreenShootAlert, setShowScreenShootAlert },
  params,
  onChange,
  onChangeStep,
}: AuthCreateParamsProps): ReactElement<AuthCreateParamsProps> {
  const theme = useTheme();
  const { register, watch } = useForm();

  useEffect(() => {
    const newParams: AuthCreateParamsCallback = {
      derivePath: watch('derivePath', params.derivePath),
      pairType: watch('pairType', params.pairType),
    };

    if (
      newParams.derivePath === params.derivePath &&
      newParams.pairType === params.pairType
    )
      return;

    onChange(newParams);
  }, [watch(), onChange, params]);

  return (
    <>
      <Dialog open={showScreenShootAlert} disableBackdropClick>
        <DialogTitle>请勿截图</DialogTitle>
        <DialogContent>
          <DialogContentText>
            请勿截屏分享和存储,这可能将被第三方恶意软件手机,造成资产损失.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowScreenShootAlert(false)}
            color="secondary"
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <List dense>
          <ListItem>
            <ListItemText
              primary="备份助记词"
              secondary="使用纸和笔正确抄写助记词--如果你的手机丢失、被盗、损坏,助记词将可以恢复你的资产."
            />
          </ListItem>
          <Box px={2} py={1}>
            <Paper variant="outlined">
              <Box p={1} style={{ backgroundColor: theme.palette.error.dark }}>
                <Typography variant="subtitle1">
                  {params.seed || (
                    <>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </>
                  )}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </List>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>高级选项</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <form>
              <TextField
                name="pairType"
                label="密钥对加密类型"
                inputRef={register}
                margin="dense"
                variant="filled"
                fullWidth
                defaultValue={params.pairType}
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
                inputRef={register}
                margin="dense"
                variant="filled"
                fullWidth
                defaultValue={params.derivePath}
                InputLabelProps={{ shrink: true }}
                helperText={
                  params.deriveValidation?.error ||
                  params.deriveValidation?.warning ||
                  '派生路径允许你由相同的基础助记词创建不同的账户。'
                }
                placeholder="//硬/软///密码"
                error={!!params.deriveValidation?.error}
              />
            </form>
          </AccordionDetails>
        </Accordion>
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
            onClick={() => onChangeStep(1)}
          >
            上一步
          </Button>
        </Toolbar>
        <Toolbar>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={() => onChangeStep(3)}
            disabled={
              !!params.deriveValidation?.error ||
              !!params.deriveValidation?.warning
            }
          >
            下一步
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default memo(AuthCreateParams);
