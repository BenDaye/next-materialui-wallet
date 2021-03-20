import React, { memo, ReactElement, useCallback } from 'react';
import type { BaseProps } from '@@/types';
import styles from '@styles/AccountSelector.module.css';
import {
  Box,
  CircularProgress,
  IconButton,
  createStyles,
  makeStyles,
  Theme,
  ButtonBase,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import Image from 'material-ui-image';
import BitcoinIcon from 'mdi-material-ui/Bitcoin';
import EthereumIcon from 'mdi-material-ui/Ethereum';
import { NodeListProvider } from '@components/setting/components/NodeList';
import { useSetting } from '@@/hook';
import type { Node } from '@components/setting/types';
import { useRouter } from 'next/router';

interface NodeListProps extends BaseProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);

function NodeList({ children }: NodeListProps): ReactElement<NodeListProps> {
  const classes = useStyles();
  const router = useRouter();
  const { node, setNode } = useSetting();

  const onSelect = useCallback(
    (n: Node) => {
      if (n.url === node.url) return;
      setNode(n);
      router.reload();
    },
    [node, setNode]
  );

  return (
    <>
      <Box
        flexShrink={0}
        bgcolor="primary.dark"
        className={styles.content}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {/* <ButtonBase focusRipple>
          <Box p={1.5}>
            <Box className={classes.small}>
              <Image
                src="/img/loading.png"
                aspectRatio={1}
                loading={<CircularProgress size={24} />}
                color="transparent"
                imageStyle={{
                  filter: 'grayscale(0)',
                }}
              />
            </Box>
          </Box>
        </ButtonBase> */}
        <NodeListProvider variant="icon" onSelect={onSelect}>
          <ListItem button disabled>
            <ListItemIcon>
              <BitcoinIcon fontSize="large" />
            </ListItemIcon>
          </ListItem>
          <ListItem button disabled>
            <ListItemIcon>
              <EthereumIcon fontSize="large" />
            </ListItemIcon>
          </ListItem>
        </NodeListProvider>
      </Box>
      {children}
    </>
  );
}

export default memo(NodeList);
