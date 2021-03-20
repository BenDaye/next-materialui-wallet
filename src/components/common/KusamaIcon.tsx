import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Kusama } from '@public/img/kusama-ksm-logo.svg';

interface KusamaIconProps extends BaseProps {
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
}

function KusamaIcon({
  children,
  fontSize,
}: KusamaIconProps): ReactElement<KusamaIconProps> {
  return (
    <SvgIcon
      component={Kusama}
      fontSize={fontSize}
      viewBox="0 0 441 441"
    ></SvgIcon>
  );
}

export default memo(KusamaIcon);
