import { useChain } from '@components/polkadot';
import { Children } from '@components/types';
import { Box, Container, Typography } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';
import { BestFinalized, BestNumber, Common, TotalIssuance } from './index';

function ChainExplorerProvider({ children }: Children): ReactElement<Children> {
  const {
    systemName = '',
    ss58Format = -1,
    tokenDecimals = '',
    tokenSymbol = '',
    genesisHash = '',
  } = useChain();
  return (
    <>
      <Container>
        <Box marginTop={2}>
          <Typography variant="subtitle2">链</Typography>
          <Common id="system_name" label="系统名称" value={systemName} />
          <TotalIssuance />
        </Box>
        <Box marginTop={2}>
          <Typography variant="subtitle2">区块</Typography>
          <BestNumber />
          <BestFinalized />
        </Box>
        <Box marginTop={2}>
          <Typography variant="subtitle2">注册信息</Typography>
          <Common id="genesis_hash" label="创世哈希" value={genesisHash} />
          <Common id="token_symbol" label="默认单位" value={tokenSymbol} />
          <Common id="ss58format" label="地址前缀" value={ss58Format} />
          <Common id="token_decimals" label="数量精度" value={tokenDecimals} />
        </Box>
      </Container>
      {children}
    </>
  );
}

export default memo(ChainExplorerProvider);
