import React, { Fragment, memo, ReactElement, useState } from 'react';
import type { BaseProps } from '@@/types';
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
import type { Node } from '../types';

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

export const NodeDialog = memo(NodeDialogBase);
