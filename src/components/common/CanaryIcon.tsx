import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Canary } from '@public/img/canary-canary-logo.svg';

interface CanaryIconProps extends BaseProps {
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
}

function CanaryIcon({
  children,
  fontSize,
}: CanaryIconProps): ReactElement<CanaryIconProps> {
  return (
    <SvgIcon
      component={Canary}
      fontSize={fontSize}
      viewBox="0 0 176 176"
    ></SvgIcon>
  );
}

export default memo(CanaryIcon);
