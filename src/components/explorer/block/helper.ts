import type { KeyedEvent } from '@components/polkadot/event/types';
import type { HeaderExtended } from '@polkadot/api-derive';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';

export const transformResult = ([events, block, header]: [
  EventRecord[],
  SignedBlock,
  HeaderExtended?
]): [KeyedEvent[], SignedBlock, HeaderExtended?] => [
  events.map((record, index) => ({
    indexes: [index],
    key: `${Date.now()}-${index}-${record.hash.toHex()}`,
    record,
    blockHash: block.hash.toHex(),
    blockNumber: header?.number.unwrap(),
  })),
  block,
  header,
];
