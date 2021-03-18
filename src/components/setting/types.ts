import { Dispatch, SetStateAction } from 'react';
import { ApiOptions } from '@polkadot/api/types';

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
