import { Typography } from '@material-ui/core';
import React, { memo, ReactElement } from 'react';

interface CardContentItemValueProps {
  value: string;
}

function CardContentItemValue({
  value,
}: CardContentItemValueProps): ReactElement<CardContentItemValueProps> {
  return (
    <Typography
      variant="caption"
      color="textSecondary"
      gutterBottom
      className="text-overflow-ellipsis_one_line"
      component="p"
    >
      {value}
    </Typography>
  );
}

export default memo(CardContentItemValue);
