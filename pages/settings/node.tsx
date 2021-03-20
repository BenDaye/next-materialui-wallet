import { PageHeader } from '@components/common';
import { useSetting } from '@@/hook';
import { Box, Button, Container, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import type { Node } from '@components/setting/types';
import { useRouter } from 'next/router';
import { NodeListProvider } from '@components/setting/components/NodeList';

export default function NodePage() {
  const router = useRouter();
  const { node, setNode } = useSetting();
  const [selectedNode, setSelectedNode] = useState<Node>(node);

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
            <NodeListProvider select onSelect={setSelectedNode} />
          </Paper>
        </Box>
      </Container>
    </>
  );
}
