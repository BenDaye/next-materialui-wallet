import React, { Fragment, memo, ReactElement, useState } from 'react';
import type { Children } from '@components/types';
import { useChain } from '@components/polkadot/hook';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Checkbox,
} from '@material-ui/core';
import type { Node } from '@components/common';

interface NodeDialogProps extends Children {
  open: boolean;
  node: Node;
  nodes: Node[];
  onChange: (node: Node) => void;
}

function NodeDialog({
  children,
  open,
  node,
  nodes,
  onChange,
}: NodeDialogProps): ReactElement<NodeDialogProps> {
  const [selectedNode, setSelectedNode] = useState<Node>(node);
  return (
    <>
      <Dialog open={open} scroll="paper">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="subtitle1">节点管理</Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <List disablePadding dense>
            {nodes.map((n, index, array) => (
              <Fragment key={`node-${n.name}`}>
                <ListItem
                  disableGutters
                  button
                  onClick={() => setSelectedNode(n)}
                  divider
                >
                  <ListItemText primary={n.name} secondary={n.description} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={() => setSelectedNode(n)}
                      checked={n.url === selectedNode.url}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onChange(selectedNode)} color="secondary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default memo(NodeDialog);