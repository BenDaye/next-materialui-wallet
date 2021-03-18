import { NodeDialog } from './components/NodeDialog';
import type { Children } from '@components/types';
import { useRouter } from 'next/router';
import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SettingContext } from './context';
import { DEFAULT_NODES } from './helper';
import { Node } from './types';
import store from 'store';

interface SettingProps extends Children {}

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
