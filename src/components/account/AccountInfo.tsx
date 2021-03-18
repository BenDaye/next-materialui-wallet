import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BaseProps } from '@@/types';
import {
  useAccountFullByAddress,
  useAccount,
  useChain,
  useNotice,
} from '@@/hook';
import type { AccountFullProps } from '@components/polkadot/account/types';
import {
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
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
import Identicon from '@polkadot/react-identicon';
import { getShortAddress } from '@utils/getShortAddress';
import ReactQr from 'qrcode.react';
import useCopy from '@react-hook/copy';
import AccountInfoSkeleton from './AccountInfoSkeleton';
import QrcodeIcon from 'mdi-material-ui/Qrcode';

interface AccountInfoProps extends BaseProps {
  value: string | null;
  showBalance?: boolean;
  showAddress?: boolean;
  showQrcode?: boolean;
  select?: boolean;
  onSelect?: (info: AccountFullProps) => void;
  dense?: boolean;
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
  onlyItem = false,
  showBadge = false,
}: AccountInfoProps): ReactElement<AccountInfoProps> | null {
  const { systemChain } = useChain();
  const { copy, copied } = useCopy(value || '');
  const { showSuccess } = useNotice();
  const { currentAccount, setCurrentAccount } = useAccount();
  const [showQr, setShowQr] = useState<boolean>(false);
  const info = useAccountFullByAddress(value);
  const classes = useStyles();

  const selectClass: string | undefined = useMemo(() => {
    if (!!select) {
      return value === currentAccount ? classes.selected : classes.unselected;
    }
    return;
  }, [value, currentAccount, select, classes]);

  const formatName: string = useMemo(
    () =>
      info
        ? `${
            info.flags.isDevelopment ? '[TEST] ' : ''
          }${info.name.toUpperCase()}`
        : '/',
    [info]
  );

  useEffect(() => {
    copied && showSuccess('已复制地址到剪贴板');
  }, [copied]);

  const handleClick = useCallback(() => {
    if (showQrcode) {
      setShowQr(true);
    } else if (select) {
      setCurrentAccount(value);
    }
    onSelect && onSelect(info);
  }, [value, info, onSelect, showQrcode]);

  if (!value) return <AccountInfoSkeleton />;

  const MainItem: ReactElement = (
    <ListItem
      button
      onClick={handleClick}
      divider={showAddress || showBalance}
      dense={dense}
    >
      <ListItemAvatar>
        <Identicon value={value} size={32} />
      </ListItemAvatar>
      <ListItemText
        primary={formatName}
        primaryTypographyProps={{
          variant: dense ? 'body2' : 'body1',
        }}
        secondary={
          select || !showAddress ? getShortAddress(value) : systemChain
        }
        secondaryTypographyProps={{ variant: 'caption' }}
      />
      <ListItemSecondaryAction>
        {select ? (
          <Checkbox
            checked={value === currentAccount}
            disabled={value === currentAccount}
            onChange={() => setCurrentAccount(value)}
          />
        ) : showQrcode ? (
          <QrcodeIcon onClick={() => setShowQr(true)} />
        ) : showBadge ? (
          value === currentAccount && (
            <Chip label="当前账户" color="secondary" size="small" />
          )
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
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
                  {getShortAddress(value)}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </List>
      </Paper>
      <Dialog open={showQr} onClose={() => setShowQr(false)} fullWidth>
        <List>
          <ListItem dense>
            <ListItemAvatar>
              <Identicon value={value} size={32} />
            </ListItemAvatar>
            <ListItemText
              primary={formatName}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={systemChain}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        </List>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <NoSsr>
              {value && (
                <Box mb={1}>
                  <ReactQr value={value} includeMargin size={240} />
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
}

export default memo(AccountInfo);
