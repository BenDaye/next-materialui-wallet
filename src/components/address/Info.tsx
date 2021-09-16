import { BaseProps } from '@@/types';
import { useAddresses } from '@components/php/address/hook';
import { AddressProps } from '@components/php/address/types';
import { List, ListItem, ListItemText, Paper, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';
import { getShortAddress } from '@utils/getShortAddress';
import { useRouter } from 'next/router';
import React, { ReactElement, memo, useCallback } from 'react';

interface AddressInfoProps extends BaseProps {
  value?: AddressProps;
  dense?: boolean;
  disableGutters?: boolean;
  onlyItem?: boolean;
}

function AddressInfo({
  children,
  value,
  dense = false,
  disableGutters = false,
  onlyItem = false,
}: AddressInfoProps): ReactElement<AddressInfoProps> | null {
  if (!value) return null;
  const router = useRouter();
  const { addresses, update } = useAddresses();

  const handleClick = useCallback(() => {
    router.push(`/address/${value.uuid}`);
  }, [value]);

  const MainItem: ReactElement = (
    <>
      <ListItem
        button
        onClick={handleClick}
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
      </ListItem>
    </>
  );

  if (onlyItem) return MainItem;

  return (
    <>
      <Paper>
        <List disablePadding={dense}>{MainItem}</List>
      </Paper>
    </>
  );
}

export default memo(AddressInfo);
