import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Typography,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatNumber } from '@polkadot/util';
import { HeaderExtended } from '@polkadot/api-derive';
import React, { memo, ReactElement, ReactNode } from 'react';

interface Children {
  children?: ReactNode;
  header: HeaderExtended;
}

function BlockProvider({ children, header }: Children): ReactElement<Children> {
  const { number, parentHash, extrinsicsRoot, stateRoot } = header;
  return (
    <>
      <Card>
        <CardHeader
          title={formatNumber(number.toNumber())}
          action={
            <IconButton aria-label="more" size="medium">
              <MoreVertIcon />
            </IconButton>
          }
        />
        <Divider variant="middle" />
        <CardContent>
          <Typography variant="subtitle2">父亲/母亲</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            className="text-overflow-ellipsis_one_line"
          >
            {parentHash.toString()}
          </Typography>
          <Typography variant="subtitle2">事件哈希</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            className="text-overflow-ellipsis_one_line"
          >
            {extrinsicsRoot.toString()}
          </Typography>
          <Typography variant="subtitle2">状态哈希</Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            className="text-overflow-ellipsis_one_line"
          >
            {stateRoot.toString()}
          </Typography>
        </CardContent>
      </Card>
      {children}
    </>
  );
}

export default memo(BlockProvider);
