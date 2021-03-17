import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Kusama } from '../../../public/img/kusama-ksm-logo.svg';

interface KusamaIconProps extends Children {}

function KusamaIcon({
  children,
}: KusamaIconProps): ReactElement<KusamaIconProps> {
  return <SvgIcon component={Kusama} viewBox="0 0 441 441"></SvgIcon>;
}

export default memo(KusamaIcon);
