import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
  ReactNode,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice, useSetting } from '@@/hook';
import {
  Box,
  Checkbox,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core';
import CatIcon from 'mdi-material-ui/Cat';
import HelpCircleIcon from 'mdi-material-ui/HelpCircle';
import { PolkadotIcon, KusamaIcon, UeccIcon } from '@components/common';
import { Node } from '../types';

type NodeListVariant =
  | 'icon'
  | 'icon&primary'
  | 'primary'
  | 'primary&secondary'
  | 'full';

interface NodeListProps extends BaseProps {
  dense?: boolean;
  disableGutters?: boolean;
  variant?: NodeListVariant;
  select?: boolean;
  onSelect?: (n: Node) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: theme.spacing(8),
    },
  })
);

function NodeList({
  children,
  dense = false,
  disableGutters = false,
  variant = 'full',
  select = false,
  onSelect = (n: Node) => {},
}: NodeListProps): ReactElement<NodeListProps> {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const { node, nodes } = useSetting();
  const [selectedNode, setSelectedNode] = useState<Node>(node);
  const classes = useStyles();

  const getNodeIcon = (name?: string): ReactNode => {
    switch (name) {
      case 'Polkadot':
        return <PolkadotIcon fontSize="large" />;
      case 'Kusama':
        return <KusamaIcon fontSize="large" />;
      case 'UECC':
        return <UeccIcon fontSize="large" />;
      case 'Sycamore':
        return <CatIcon fontSize="large" />;
      default:
        return <HelpCircleIcon fontSize="large" />;
    }
  };

  useEffect(() => {
    if (selectedNode) {
      onSelect(selectedNode);
    }
  }, [selectedNode, nodes]);

  return (
    <Box className={variant === 'icon' ? classes.icon : ''} overflow="hidden">
      <List dense={dense}>
        {nodes.map((n, index, array) => (
          <Fragment key={`node: ${n.url}`}>
            <ListItem
              button
              onClick={() => setSelectedNode(n)}
              selected={variant === 'icon' && n.url === node.url}
              disableGutters={disableGutters}
            >
              {(variant === 'full' ||
                variant === 'icon' ||
                variant === 'icon&primary') && (
                <ListItemIcon>{getNodeIcon(n.name)}</ListItemIcon>
              )}
              {(variant === 'full' || variant === 'primary&secondary') && (
                <ListItemText primary={n.name} secondary={n.description} />
              )}
              {(variant === 'primary' || variant === 'icon&primary') && (
                <ListItemText primary={n.name} />
              )}
              {select && (
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    onChange={() => setSelectedNode(n)}
                    checked={n.url === selectedNode.url}
                  />
                </ListItemSecondaryAction>
              )}
            </ListItem>
            {index < array.length - 1 && variant !== 'icon' && (
              <Divider
                variant={disableGutters ? 'fullWidth' : 'inset'}
                component="li"
              />
            )}
          </Fragment>
        ))}
        {children}
      </List>
    </Box>
  );
}

export const NodeListProvider = memo(NodeList);
