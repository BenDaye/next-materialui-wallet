import {
  Typography,
  Container,
  CardHeader,
  Avatar,
  IconButton,
  Card,
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemSecondaryAction,
  ListItemIcon,
  ListItemAvatar,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { useRouter } from 'next/router';
import { PageHeader } from '@components/common';
import { useChain } from '@@/hook';
import ChevronRightIcon from 'mdi-material-ui/ChevronRight';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  })
);

export default function ExplorerPage() {
  const classes = useStyles();
  const router = useRouter();
  const { chains } = useChain();
  return (
    <>
      <PageHeader
        title={
          <Typography variant="subtitle1" align="center">
            区块浏览器
          </Typography>
        }
        showBack={false}
      />
      <Container>
        <Box mt={2}>
          <Card>
            <List>
              {chains.map((chain) => (
                <ListItem button>
                  <ListItemAvatar>
                    <Box p={2}>
                      <Avatar
                        src={`/img/${chain.name}@2x.png`}
                        variant="circular"
                        className={classes.icon}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText primary={chain.full_name} />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="link">
                      <ChevronRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Card>
        </Box>
      </Container>
    </>
  );
}
