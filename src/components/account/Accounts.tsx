import React, { memo, ReactElement, useCallback, useMemo } from 'react';
import type { BaseProps } from '@@/types';
import { Box, Container } from '@material-ui/core';
import styles from '@styles/AccountSelector.module.css';
import AccountInfoSkeleton from './InfoSkeleton';
import AccountInfo from './Info';
import { AccountProps } from '@components/php/account/types';
import { useAccounts, useChain } from '@@/hook';

interface AccountSelectorListProps extends BaseProps {
  onSelect?: (info: AccountProps) => void;
  toDetails?: boolean;
  select?: boolean;
}

function AccountSelectorList({
  children,
  onSelect,
  toDetails = true,
  select = false,
}: AccountSelectorListProps): ReactElement<AccountSelectorListProps> {
  const { chains } = useChain();
  const currentChain = useMemo(() => chains.find((c) => c.activated), [chains]);
  const { accounts, hasAccount } = useAccounts();
  const _accounts = useMemo(() => {
    return hasAccount && currentChain
      ? accounts.filter((a) => a.chain_type === currentChain.name)
      : [];
  }, [currentChain, accounts, hasAccount]);

  return (
    <>
      <Box
        flexGrow={1}
        bgcolor="background.default"
        className={styles.content}
        py={1}
      >
        <Container>
          <Box className="width-fill-available">
            {_accounts.length ? (
              _accounts.map((account) => (
                <Box key={`account: ${account.uuid}`} mb={1}>
                  <AccountInfo
                    value={account}
                    dense
                    showAddress
                    toDetails={toDetails}
                    select={select}
                    onSelect={onSelect}
                  />
                </Box>
              ))
            ) : (
              <AccountInfoSkeleton />
            )}
          </Box>
        </Container>
      </Box>
      {children}
    </>
  );
}

export default memo(AccountSelectorList);
