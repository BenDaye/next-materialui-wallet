import type { KeyedEvent } from '@components/polkadot/event/types';
import { Children } from '@components/types';
import type {
  BlockNumber,
  Extrinsic as ExtrinsicType,
} from '@polkadot/types/interfaces';
import React, { memo, ReactElement } from 'react';
import Extrinsic from './Extrinsic';

interface ExtrinsicsProps extends Children {
  blockNumber?: BlockNumber;
  extrinsics?: ExtrinsicType[] | null;
  events?: KeyedEvent[];
}

function Events({
  children,
  extrinsics,
  blockNumber,
  events,
}: ExtrinsicsProps): ReactElement<ExtrinsicsProps> {
  return (
    <>
      {extrinsics?.map((extrinsic, index) => (
        <Extrinsic
          key={`extrinsic:${index}`}
          index={index}
          blockNumber={blockNumber}
          events={events}
          extrinsic={extrinsic}
        />
      ))}
      {children}
    </>
  );
}

export default memo(Events);
