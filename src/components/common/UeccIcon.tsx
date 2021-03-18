import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as Uecc } from '@public/img/uecc-uecc-logo.svg';

interface UeccIconProps extends BaseProps {}

function UeccIcon({ children }: UeccIconProps): ReactElement<UeccIconProps> {
  return <SvgIcon component={Uecc} viewBox="0 0 176 176"></SvgIcon>;
}

export default memo(UeccIcon);
