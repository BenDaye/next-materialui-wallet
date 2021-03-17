import React, {
  Context,
  createContext,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Children } from '@components/types';
import { useChain } from '@components/polkadot/hook';
import { Box } from '@material-ui/core';
import { ApiOptions } from '@polkadot/api/types';
import store from 'store';
import { NodeDialog } from '@components/common';
import { useRouter } from 'next/router';

interface SettingProps extends Children {}

export interface Node {
  url: string;
  options?: ApiOptions;
  name?: string;
  description?: string;
}

export interface SettingContextProps {
  node: Node;
  nodes: Node[];
  setNode: Dispatch<SetStateAction<Node>>;
  showNodeDialogAction: () => void;
}

// export const DEFAULT_NODE: Node = {
//   name: 'UECC',
//   description:
//     'Created by Mr.Shan, a genius who is known as the once-in-a-century',
//   url: 'ws://221.122.102.163:9944',
//   options: {
//     types: {
//       Address: 'AccountId',
//       LookupSource: 'AccountId',
//       URC10: {
//         symbol: 'Vec<u8>',
//         name: 'Vec<u8>',
//         decimals: 'u8',
//         max_supply: 'u64',
//       },
//     },
//   },
// };

export const DEFAULT_NODES: Node[] = [
  {
    name: 'UECC',
    description:
      'Created by Mr.Shan, a blockchain developer who is known as the once-in-a-century genius',
    url: 'ws://221.122.102.163:9944',
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

export const SettingContext: Context<SettingContextProps> = createContext<SettingContextProps>(
  {
    node: DEFAULT_NODES[0],
    nodes: DEFAULT_NODES,
    setNode: (node: Node) => {},
    showNodeDialogAction: () => {},
  }
);

function Setting({ children }: SettingProps): ReactElement<SettingProps> {
  const router = useRouter();
  const [node, setNode] = useState<Node>(store.get('node', DEFAULT_NODES[0]));
  const [showNodeDialog, setShowNodeDialog] = useState<boolean>(false);
  useEffect(() => {
    store.set('node', node || DEFAULT_NODES[0]);
  }, [node]);

  const showNodeDialogAction = useCallback(() => {
    setShowNodeDialog(true);
  }, [showNodeDialog, setShowNodeDialog]);

  const value = useMemo(() => {
    return {
      node,
      nodes: DEFAULT_NODES,
      setNode,
      showNodeDialogAction,
    };
  }, [node, store, showNodeDialogAction]);

  const onChangeNode = useCallback(
    (selectedNode: Node) => {
      setNode(selectedNode);
      setShowNodeDialog(false);
      router.reload();
    },
    [setNode]
  );

  return (
    <>
      <SettingContext.Provider value={value}>
        {children}
        <NodeDialog
          open={showNodeDialog}
          node={node}
          nodes={value.nodes}
          onChange={onChangeNode}
        />
      </SettingContext.Provider>
    </>
  );
}

export const SettingProvider = memo(Setting);

export const useSetting = (): SettingContextProps =>
  useContext<SettingContextProps>(SettingContext);
