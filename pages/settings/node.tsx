import {
  PageHeader,
  PolkadotIcon,
  KusamaIcon,
  UeccIcon,
} from '@components/common';
import { useSetting } from '@@/hook';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from '@material-ui/core';
import React, { Fragment, ReactNode, useState } from 'react';
import type { Node } from '@components/setting/types';
import CatIcon from 'mdi-material-ui/Cat';
import HelpCircleIcon from 'mdi-material-ui/HelpCircle';
import Image from 'material-ui-image';
import { useRouter } from 'next/router';

export default function NodePage() {
  const router = useRouter();
  const { nodes, node, setNode } = useSetting();
  const [selectedNode, setSelectedNode] = useState<Node>(node);

  function getNodeIcon(name?: string): ReactNode {
    switch (name) {
      case 'Polkadot':
        return <PolkadotIcon />;
      case 'Kusama':
        return <KusamaIcon />;
      case 'UECC':
        return <UeccIcon />;
      case 'Sycamore':
        return <CatIcon />;
      default:
        return <HelpCircleIcon />;
    }
  }

  return (
    <>
      <PageHeader
        title="节点管理"
        right={
          <Button
            variant="contained"
            color="secondary"
            disabled={selectedNode.url === node.url}
            onClick={() => {
              setNode(selectedNode);
              router.reload();
            }}
          >
            切换
          </Button>
        }
      />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Paper>
            <List>
              {nodes.map((n, index, array) => (
                <Fragment key={`node-${n.url}`}>
                  <ListItem button onClick={() => setSelectedNode(n)}>
                    <ListItemIcon>{getNodeIcon(n.name)}</ListItemIcon>
                    <ListItemText primary={n.name} secondary={n.description} />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        onChange={() => setSelectedNode(n)}
                        checked={n.url === selectedNode.url}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < array.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
