import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import { useNotice, useAccounts, useBalance } from '@@/hook';
import {
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  NoSsr,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import { getShortAddress } from '@utils/getShortAddress';
import ReactQr from 'qrcode.react';
import useCopy from '@react-hook/copy';
import { AccountInfoSkeleton } from './index';
import QrcodeIcon from 'mdi-material-ui/Qrcode';
import { AccountProps } from '@components/php/account/types';
import { useRouter } from 'next/router';

interface AccountInfoProps extends BaseProps {
  value?: AccountProps;
  toDetails?: boolean;
  showBalance?: boolean;
  showAddress?: boolean;
  showQrcode?: boolean;
  select?: boolean;
  onSelect?: (value: AccountProps) => void;
  dense?: boolean;
  disableGutters?: boolean;
  onlyItem?: boolean;
  showBadge?: boolean;
  divider?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selected: {
      backgroundColor: theme.palette.primary.main,
    },
    unselected: {
      // backgroundColor: theme.palette.primary.light,
    },
  })
);

function AccountInfo({
  children,
  value,
  toDetails = true,
  showBalance = false,
  showAddress = false,
  showQrcode = false,
  select = false,
  onSelect,
  dense = false,
  disableGutters = false,
  onlyItem = false,
  showBadge = false,
  divider = false,
}: AccountInfoProps): ReactElement<AccountInfoProps> | null {
  if (!value) return <AccountInfoSkeleton />;
  const router = useRouter();
  const { accounts, activateAccount } = useAccounts();
  const balance = useBalance({
    chain_type: value?.chain_type || '',
    uuid: value?.uuid || '',
    address: value?.address || '',
  });
  const { copy, copied } = useCopy(value?.address || '');
  const { showSuccess } = useNotice();
  const [showQr, setShowQr] = useState<boolean>(false);
  const classes = useStyles();

  const selectClass: string | undefined = useMemo(() => {
    if (!!select) {
      return value.activated ? classes.selected : classes.unselected;
    }
    return;
  }, [value, select, classes]);

  useEffect(() => {
    copied && showSuccess('已复制地址到剪贴板');
  }, [copied]);

  const handleClick = useCallback(() => {
    if (toDetails) {
      router.push(`/account/${value.uuid}`);
    } else if (showQrcode) {
      setShowQr(true);
    } else if (select) {
      activateAccount(value);
    }
    onSelect && onSelect(value);
  }, [value, onSelect, showQrcode, toDetails, select]);

  const MainItem: ReactElement = (
    <>
      <ListItem
        button
        onClick={handleClick}
        divider={divider}
        dense={dense}
        disableGutters={disableGutters}
      >
        <ListItemText
          primary={value.name}
          primaryTypographyProps={{
            variant: dense ? 'body2' : 'body1',
          }}
          secondary={getShortAddress(value.address)}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
        <ListItemSecondaryAction>
          {showQrcode ? <QrcodeIcon onClick={() => setShowQr(true)} /> : null}
          {showBadge
            ? value.activated && (
                <Chip label="当前账户" color="secondary" size="small" />
              )
            : null}
          {showBalance ? <Typography>{balance.balance}</Typography> : null}
        </ListItemSecondaryAction>
      </ListItem>
      <Dialog open={showQr} onClose={() => setShowQr(false)} fullWidth>
        <List>
          <ListItem dense>
            <ListItemText
              primary={value.name}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={getShortAddress(value.address)}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        </List>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <NoSsr>
              {value && (
                <Box mb={1}>
                  <ReactQr value={value.address} includeMargin size={240} />
                </Box>
              )}
            </NoSsr>
            <Typography variant="body2" className="word-break">
              {value.address}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={copy} color="primary" fullWidth variant="contained">
            复制
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  if (onlyItem) {
    return MainItem;
  }

  return (
    <>
      <Paper className={selectClass}>
        <List disablePadding={dense}>
          {MainItem}
          {/* {showAddress && (
            <ListItem dense>
              <ListItemText primary="地址" />
              <ListItemSecondaryAction>
                <Typography color="textPrimary" variant="caption">
                  {getShortAddress(value.address)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )} */}
        </List>
      </Paper>
    </>
  );
}

export default memo(AccountInfo);
