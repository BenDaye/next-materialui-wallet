import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import { useNotice } from '@@/hook';
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
import AccountInfoSkeleton from './AccountInfoSkeleton';
import QrcodeIcon from 'mdi-material-ui/Qrcode';
import { useAccounts } from '@components/php/account/hook';
import { AccountBaseProps } from '@components/php/account/types';

interface AccountInfoProps extends BaseProps {
  value: AccountBaseProps;
  showBalance?: boolean;
  showAddress?: boolean;
  showQrcode?: boolean;
  select?: boolean;
  onSelect?: (value: AccountBaseProps) => void;
  dense?: boolean;
  disableGutters?: boolean;
  onlyItem?: boolean;
  showBadge?: boolean;
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
  showBalance = false,
  showAddress = false,
  showQrcode = false,
  select = false,
  onSelect,
  dense = false,
  disableGutters = false,
  onlyItem = false,
  showBadge = false,
}: AccountInfoProps): ReactElement<AccountInfoProps> | null {
  const { copy, copied } = useCopy(value?.address || '');
  const { showSuccess } = useNotice();
  const { currentAccount, setCurrentAccount } = useAccounts();
  const [showQr, setShowQr] = useState<boolean>(false);
  const classes = useStyles();

  const selectClass: string | undefined = useMemo(() => {
    if (!!select) {
      return value.uuid === currentAccount
        ? classes.selected
        : classes.unselected;
    }
    return;
  }, [value, currentAccount, select, classes]);

  const formatName: string = useMemo(
    () => (value ? `[${value.chain_type}] ${value.name}` : ''),
    [value]
  );

  useEffect(() => {
    copied && showSuccess('已复制地址到剪贴板');
  }, [copied]);

  const handleClick = useCallback(() => {
    if (showQrcode) {
      setShowQr(true);
    } else if (select) {
      setCurrentAccount(value.uuid);
    }
    onSelect && onSelect(value);
  }, [value, onSelect, showQrcode]);

  if (!value) return <AccountInfoSkeleton />;

  const MainItem: ReactElement = (
    <>
      <ListItem
        button
        onClick={handleClick}
        divider={showAddress || showBalance}
        dense={dense}
        disableGutters={disableGutters}
      >
        <ListItemText
          primary={formatName}
          primaryTypographyProps={{
            variant: dense ? 'body2' : 'body1',
          }}
          secondary={
            select || !showAddress
              ? value.chain_type
              : getShortAddress(value.address)
          }
          secondaryTypographyProps={{ variant: 'caption' }}
        />
        <ListItemSecondaryAction>
          {select ? (
            <Checkbox
              checked={value.uuid === currentAccount}
              disabled={value.uuid === currentAccount}
              onChange={() => setCurrentAccount(value.uuid)}
            />
          ) : showQrcode ? (
            <QrcodeIcon onClick={() => setShowQr(true)} />
          ) : showBadge ? (
            value.uuid === currentAccount && (
              <Chip label="当前账户" color="secondary" size="small" />
            )
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>
      <Dialog open={showQr} onClose={() => setShowQr(false)} fullWidth>
        <List>
          <ListItem dense>
            <ListItemText
              primary={formatName}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={value.chain_type}
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
              {value}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={copy}
            color="secondary"
            fullWidth
            variant="contained"
          >
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
          {showAddress && (
            <ListItem dense>
              <ListItemText primary="地址" />
              <ListItemSecondaryAction>
                <Typography color="textPrimary" variant="caption">
                  {getShortAddress(value.address)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </Paper>
    </>
  );
}

export default memo(AccountInfo);
