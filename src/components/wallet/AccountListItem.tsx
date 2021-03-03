import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';
import Identicon from '@polkadot/react-identicon';
import {
  useAccounts,
  useApi,
  useCall,
  useChain,
} from '@components/polkadot/hook';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import MenuIcon from '@material-ui/icons/Menu';
import { useTheme } from '@material-ui/core/styles';
import { SortedAccount } from '@components/polkadot/context';

interface AccountListItemProps extends Children {
  account: SortedAccount;
  showAddress?: boolean;
  showBalance?: boolean;
  showQrCode?: boolean;
  showSelect?: boolean;
}

function AccountListItem({
  children,
  account,
  showAddress = false,
  showBalance = false,
  showSelect = false,
  showQrCode = false,
}: AccountListItemProps): ReactElement<AccountListItemProps> {
  const { api } = useApi();
  const { systemName } = useChain();
  const { currentAccount, setCurrentAccount } = useAccounts();
  const {
    account: { address },
  } = account;
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances.all, [
    address,
  ]);
  const theme = useTheme();
  // TODO: showQrcode

  return (
    <>
      <Card
        style={
          showSelect
            ? {
                backgroundColor:
                  currentAccount === address ? theme.palette.primary.dark : '',
              }
            : {}
        }
        onClick={() => showSelect && setCurrentAccount(address)}
      >
        <CardHeader
          avatar={<Identicon value={account.account.address} size={32} />}
          title={`${account.isDevelopment ? '[TEST] ' : ''}${
            account.account.meta.name
          }`}
          titleTypographyProps={{ variant: 'button' }}
          subheader={systemName}
          subheaderTypographyProps={{ variant: 'caption' }}
          action={
            showSelect && (
              <Checkbox
                checked={currentAccount === address}
                // onChange={() => setCurrentAccount(address)}
                disabled={currentAccount === address}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            )
          }
        />
        <Divider />
        <Box paddingX={2} paddingY={1}>
          {showBalance && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" gutterBottom>
                余额
              </Typography>
              <Typography variant="caption" gutterBottom>
                {formatBalance(balancesAll?.availableBalance, {
                  withSiFull: true,
                })}
              </Typography>
            </Box>
          )}
          {showAddress && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" gutterBottom>
                地址
              </Typography>
              <Typography variant="caption" gutterBottom>
                {account.shortAddress}
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
      {children}
    </>
  );
}

export default memo(AccountListItem);
