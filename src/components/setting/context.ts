import { Context, createContext } from 'react';
import { DEFAULT_NODES } from './helper';
import { SettingContextProps, Node } from './types';

export const SettingContext: Context<SettingContextProps> = createContext<SettingContextProps>(
  {
    node: DEFAULT_NODES[0],
    nodes: DEFAULT_NODES,
    setNode: (node: Node) => {},
    showNodeDialogAction: () => {},
  }
);
