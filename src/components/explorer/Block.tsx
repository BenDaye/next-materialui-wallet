import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Typography,
} from '@material-ui/core';
import DotsVerticalIcon from 'mdi-material-ui/DotsVertical';
import { formatNumber } from '@polkadot/util';
import { HeaderExtended } from '@polkadot/api-derive';
import React, { memo, ReactElement, ReactNode } from 'react';
import { useRouter } from 'next/router';
import CardContentItemValue from './CardContentItemValue';
import { Children } from '@components/types';
interface BlockProps extends Children {
  header: HeaderExtended;
  showMoreIcon?: boolean;
  isLink?: boolean;
  contentExtended?: ReactNode;
}

function BlockProvider({
  children,
  header,
  showMoreIcon = false,
  isLink = false,
  contentExtended,
}: BlockProps): ReactElement<BlockProps> {
  const router = useRouter();
  const { number, parentHash, extrinsicsRoot, stateRoot, hash } = header;
  const handleClick = () => {
    isLink && router.push(`/block/${header.hash.toHex()}`);
  };
  return (
    <>
      <Card onClick={handleClick}>
        <CardHeader
          title={
            <Link color="secondary">{formatNumber(number.toNumber())}</Link>
          }
          action={
            showMoreIcon && (
              <IconButton aria-label="more" size="medium">
                <DotsVerticalIcon />
              </IconButton>
            )
          }
        />
        <Divider variant="middle" />
        <CardContent>
          <Typography variant="subtitle2">哈希</Typography>
          <CardContentItemValue value={hash.toHex()} />
          <Typography variant="subtitle2">父亲/母亲</Typography>
          <CardContentItemValue
            value={parentHash.isEmpty ? '-' : parentHash.toHex()}
          />
          <Typography variant="subtitle2">事件哈希</Typography>
          <CardContentItemValue value={extrinsicsRoot.toHex()} />
          <Typography variant="subtitle2">状态哈希</Typography>
          <CardContentItemValue value={stateRoot.toHex()} />
          {contentExtended}
        </CardContent>
      </Card>
      {children}
    </>
  );
}

export default memo(BlockProvider);
