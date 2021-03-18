import { useChain } from '@@/hook';
import { Children } from '@components/types';
import { Box, Container, TextField, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { memo, ReactElement } from 'react';
import { BestFinalized, BestNumber, Common, TotalIssuance } from './index';

function ChainExplorerProvider({ children }: Children): ReactElement<Children> {
  const {
    systemChain,
    systemName,
    systemVersion,
    ss58Format,
    tokenDecimals,
    tokenSymbol,
    genesisHash,
  } = useChain();
  return (
    <>
      <Container>
        <Box marginTop={2}>
          <Typography variant="subtitle2">链</Typography>
          <Common id="system_chain" label="链名称" value={systemChain} />
          <Common id="system_name" label="系统名称" value={systemName} />
          <Common id="system_version" label="系统版本" value={systemVersion} />
          <TotalIssuance />
        </Box>
        <Box marginTop={2}>
          <Typography variant="subtitle2">区块</Typography>
          <BestNumber />
          <BestFinalized />
        </Box>
        <Box marginTop={2}>
          <Typography variant="subtitle2">注册信息</Typography>
          <Common
            id="genesis_hash"
            label="创世哈希"
            multiline
            value={genesisHash}
          />
          <Common id="token_symbol" label="默认单位" value={tokenSymbol[0]} />
          <Common id="ss58format" label="地址前缀" value={ss58Format} />
          <Common
            id="token_decimals"
            label="数字精度"
            value={tokenDecimals[0]}
          />
        </Box>
      </Container>
      {children}
    </>
  );
}

export default memo(ChainExplorerProvider);
