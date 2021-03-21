import React, { memo, ReactElement, useState } from 'react';
import type { BaseProps } from '@@/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import type { Node } from '../types';
import { NodeListProvider } from './NodeList';

interface NodeDialogProps extends BaseProps {
  open: boolean;
  node: Node;
  nodes: Node[];
  onChange: (node: Node) => void;
}

function NodeDialogBase({
  children,
  open,
  node,
  nodes,
  onChange,
}: NodeDialogProps): ReactElement<NodeDialogProps> {
  const [selectedNode, setSelectedNode] = useState<Node>(() => node);
  return (
    <>
      <Dialog open={open} scroll="paper" fullWidth>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="subtitle1">节点管理</Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <NodeListProvider
            variant="primary"
            disableGutters
            select
            onSelect={setSelectedNode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onChange(selectedNode)} color="secondary">
            切换
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const NodeDialog = memo(NodeDialogBase);
