import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import FolderIcon from '@material-ui/icons/Folder'
import Identicon from '@polkadot/react-identicon'
import React from 'react'

export default function Wallet() {
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="h6" align="center">
              钱包
            </Typography>
          </Box>
          <IconButton edge="end" color="inherit" aria-label="scan">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container>
        <Box display="flex" flexDirection="column" marginTop={1}>
          <Card>
            <CardContent>
              <List dense disablePadding>
                <ListItem dense disableGutters>
                  <ListItemAvatar>
                    <Identicon
                      value="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
                      size={40}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="TEST" secondary="Development" />
                </ListItem>
                <ListItem dense disableGutters>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText secondary="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          <Box marginTop={2}>
            <Typography variant="h6">资产</Typography>
          </Box>
          <Box marginTop={1}>
            <Box marginBottom={1}>
              <Paper>
                <List disablePadding>
                  <ListItem>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="UECC" />
                    <ListItemSecondaryAction>
                      <Typography>1.00</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Box>
            <Box marginBottom={1}>
              <Paper>
                <List disablePadding>
                  <ListItem>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary="UECC" />
                    <ListItemSecondaryAction>
                      <Typography>1.00</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  )
}
