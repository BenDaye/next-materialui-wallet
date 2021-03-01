import React, { Fragment, memo, ReactElement } from 'react';
import { Children } from '@components/types';
import { useTransfers } from '@components/polkadot';
import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from '@material-ui/core';
import Identicon from '@polkadot/react-identicon';
import { formatNumber, formatBalance } from '@polkadot/util';

export interface TransferListProps extends Children {
  owner?: string | null;
  symbol?: string | null;
  counterparty?: string | null;
  direction?: number | null;
}

function shortAddress(address: string) {
  return address.length > 13
    ? `${address.slice(0, 6)}...${address.slice(-6)}`
    : address;
}

function TransferList({
  children,
  owner,
  symbol,
  counterparty,
  direction,
}: TransferListProps): ReactElement<TransferListProps> {
  const transfers = useTransfers({ owner, symbol, counterparty, direction });
  const theme = useTheme();
  return (
    <>
      <List>
        {transfers?.map((transfer, i, ts) => (
          <Fragment key={`transfer: ${transfer._id}`}>
            <ListItem>
              <ListItemAvatar>
                <Identicon value={transfer.counterparty} size={32} />
              </ListItemAvatar>
              <ListItemText
                primary={shortAddress(transfer.counterparty)}
                primaryTypographyProps={{ variant: 'subtitle2' }}
                secondary={`区块: ${formatNumber(transfer.blockNumber)}`}
                secondaryTypographyProps={{ variant: 'caption' }}
              ></ListItemText>
              <ListItemSecondaryAction>
                <Typography
                  style={{
                    color:
                      transfer.direction === 2
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {transfer.direction === 2 ? '+' : '-'}
                  {formatBalance(transfer.amount, {
                    withSiFull: true,
                    withUnit: false,
                  })}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
            {i < ts.length - 1 && <Divider variant="inset" component="li" />}
          </Fragment>
        ))}
      </List>
      {children}
    </>
  );
}

export default memo(TransferList);
