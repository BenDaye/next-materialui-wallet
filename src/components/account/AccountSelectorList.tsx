import React, { memo, ReactElement, useCallback } from 'react';
import type { BaseProps } from '@@/types';
import { useAccount, useChain } from '@@/hook';
import type { AccountFullProps } from '@components/polkadot/account/types';
import { Box, Container } from '@material-ui/core';
import styles from '@styles/AccountSelector.module.css';
import AccountInfoSkeleton from './AccountInfoSkeleton';
import AccountInfo from './AccountInfo';

interface AccountSelectorListProps extends BaseProps {
  onSelect?: (info: AccountFullProps) => void;
}

function AccountSelectorList({
  children,
  onSelect,
}: AccountSelectorListProps): ReactElement<AccountSelectorListProps> {
  const { isChainReady } = useChain();
  const { accounts, hasAccount, setCurrentAccount } = useAccount();

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
            {hasAccount ? (
              accounts.map((account) => (
                <Box key={`account: ${account}`} mb={1}>
                  <AccountInfo
                    value={account}
                    dense
                    select
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
