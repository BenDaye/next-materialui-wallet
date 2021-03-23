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
import { Box } from '@material-ui/core';
import type { Event } from '@polkadot/types/interfaces';
import { getTypeDef } from '@polkadot/types';
import type { ParamDef, ParamValue } from './types';
import { EventParam } from './param';
import type { TypeDef } from '@polkadot/types/types';

interface EventListItemParamsProps extends BaseProps {
  value: Event;
}

function Params({
  children,
  value,
}: EventListItemParamsProps): ReactElement<EventListItemParamsProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const params: ParamDef[] = value.typeDef.map(({ type }: TypeDef) => ({
    type: getTypeDef(type),
  }));
  const values: ParamValue[] = value.data.map((value) => ({
    isValid: true,
    value,
  }));

  if (!params?.length) return null;
  return (
    <>
      {params.map(({ name, type }: ParamDef, index, array) => (
        <EventParam
          key={`param: ${index}`}
          name={name}
          type={type}
          value={values[index]}
        />
      ))}
    </>
  );
}

export const EventListItemParams = memo(Params);
