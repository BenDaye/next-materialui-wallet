import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import { Box, List, ListItem, ListItemText } from '@material-ui/core';
import type { Codec, TypeDef } from '@polkadot/types/types';
import { encodeTypeDef } from '@polkadot/types/create';
import type { ParamValue } from '../types';
import { getComponent } from './helper';

interface EventParamProps extends BaseProps {
  name?: string;
  type: TypeDef;
  value: ParamValue;
}

function Param({
  children,
  name,
  type,
  value,
}: EventParamProps): ReactElement<EventParamProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();

  const Component = getComponent(type);

  const label = useMemo(
    () =>
      typeof name === 'undefined'
        ? encodeTypeDef(type)
        : `${name}: ${encodeTypeDef(type)}`,
    [name, type]
  );

  return <Component label={label} name={name} value={value} />;
}

export const EventParam = memo(Param);
