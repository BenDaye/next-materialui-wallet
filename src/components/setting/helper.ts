import { Node } from './types';

export const DEFAULT_NODES: Node[] = [
  {
    name: 'UECC',
    description:
      'UECC Official',
    url: 'ws://221.122.102.171:9944',
    options: {
      types: {
        Address: 'AccountId',
        LookupSource: 'AccountId',
        URC10: {
          symbol: 'Vec<u8>',
          name: 'Vec<u8>',
          decimals: 'u8',
          max_supply: 'u64',
        },
      },
    },
  },
  {
    name: 'Polkadot',
    description: 'Polkadot',
    url: 'wss://rpc.polkadot.io',
    options: {},
  },
  {
    name: 'Kusama',
    description: 'Kusama',
    url: 'wss://kusama-rpc.polkadot.io',
    options: {},
  },
  {
    name: 'Sycamore',
    description: 'Sycamore Development',
    url: 'wss://substrate.bendaye.vip',
    options: {},
  },
];
