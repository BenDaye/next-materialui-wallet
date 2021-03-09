import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box flexGrow={1}>
            <Typography>设置</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Paper>
            <List>
              <ListItem button onClick={() => router.push('/account')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="账户管理" />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <ArrowForwardIosIcon fontSize="small" color="action" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem button onClick={() => router.push('/address')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="地址管理" />
                <ListItemSecondaryAction>
                  <IconButton edge="end">
                    <ArrowForwardIosIcon fontSize="small" color="action" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
