import React, { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';
import { PolkadotIcon, KusamaIcon, UeccIcon } from '@components/common';
import CatIcon from 'mdi-material-ui/Cat';
import HelpCircleIcon from 'mdi-material-ui/HelpCircle';

interface NodeIconProps extends BaseProps {
  name?: string;
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
}

function NodeIconBase({
  children,
  name,
  fontSize,
}: NodeIconProps): ReactElement<NodeIconProps> {
  switch (name) {
    case 'Polkadot':
      return <PolkadotIcon fontSize={fontSize} />;
    case 'Kusama':
      return <KusamaIcon fontSize={fontSize} />;
    case 'UECC':
      return <UeccIcon fontSize={fontSize} />;
    case 'Sycamore':
      return <CatIcon fontSize={fontSize} />;
    default:
      return <HelpCircleIcon fontSize={fontSize} />;
  }
}

export const NodeIcon = memo(NodeIconBase);
