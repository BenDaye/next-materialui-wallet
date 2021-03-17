import React, { memo, ReactElement } from 'react';
import type { Children } from '@components/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Uecc } from '../../../public/img/uecc-uecc-logo.svg';

interface UeccIconProps extends Children {}

function UeccIcon({ children }: UeccIconProps): ReactElement<UeccIconProps> {
  return <SvgIcon component={Uecc} viewBox="0 0 176 176"></SvgIcon>;
}

export default memo(UeccIcon);
