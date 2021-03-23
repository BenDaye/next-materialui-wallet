import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import { Box, Container, Typography } from '@material-ui/core';
import { CommonTextField } from './CommonTextField';
import { BestNumber } from './BestNumber';
import { BestFinalized } from './BestFinalized';
import { TotalIssuance } from './TotalIssuance';

interface ChainExplorerProps extends BaseProps {}

function Explorer({
  children,
}: ChainExplorerProps): ReactElement<ChainExplorerProps> | null {
  const {
    isChainReady,
    systemChain,
    systemName,
    systemVersion,
    genesisHash,
    tokenSymbol,
    tokenDecimals,
    ss58Format,
  } = useChain();
  const { showError } = useNotice();

  if (!isChainReady) return null;
  return (
    <Box pt={2}>
      <Container>
        <Box mb={2}>
          <Typography variant="subtitle2">链</Typography>
          <CommonTextField
            id="system_chain"
            label="链名称"
            value={systemChain}
          />
          <CommonTextField
            id="system_name"
            label="系统名称"
            value={systemName}
          />
          <CommonTextField
            id="system_version"
            label="系统版本"
            value={systemVersion}
          />
          <TotalIssuance />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle2">区块</Typography>
          <BestNumber />
          <BestFinalized />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle2">注册信息</Typography>
          <CommonTextField
            id="genesis_hash"
            label="创世哈希"
            multiline
            value={genesisHash}
          />
          <CommonTextField
            id="ss58format"
            label="地址前缀"
            value={ss58Format}
          />
          <CommonTextField
            id="token_symbol"
            label="默认单位"
            value={tokenSymbol[0]}
          />
          <CommonTextField
            id="token_decimals"
            label="数字精度"
            value={tokenDecimals[0]}
          />
        </Box>
      </Container>
    </Box>
  );
}

export const ChainExplorer = memo(Explorer);
