import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Polkadot } from '@public/img/polkadot-circle.svg';

interface PolkadotIconProps extends BaseProps {}

function PolkadotIcon({
  children,
}: PolkadotIconProps): ReactElement<PolkadotIconProps> {
  return <SvgIcon component={Polkadot} viewBox="15 15 140 140"></SvgIcon>;
}

export default memo(PolkadotIcon);
