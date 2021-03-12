import {
  BlockExplorer,
  ChainExplorer,
  EventExplorer,
} from '@components/explorer';
import SwipeableViews from 'react-swipeable-views';
import {
  AppBar,
  Box,
  NoSsr,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

export default function Explorer() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box flexGrow={1}>
            <NoSsr>
              <TextField
                id="query_block"
                label="查询区块(哈希或高度)"
                variant="filled"
                color="secondary"
                fullWidth
                margin="dense"
              />
            </NoSsr>
          </Box>
        </Toolbar>
        <Box flexGrow={1}>
          <Tabs
            value={currentTabIndex}
            onChange={(e: ChangeEvent<{}>, v: number) => setCurrentTabIndex(v)}
            variant="fullWidth"
            aria-label="Explorer Navigation Tabs"
          >
            <Tab value={0} label="信息" wrapped />
            <Tab value={1} label="区块" wrapped />
            <Tab value={2} label="事件" wrapped />
          </Tabs>
        </Box>
      </AppBar>
      <Toolbar />
      <Toolbar />
      <Box flexGrow={1} py={1}>
        <SwipeableViews
          index={currentTabIndex}
          onChangeIndex={(v: number) => setCurrentTabIndex(v)}
        >
          <Box hidden={currentTabIndex !== 0}>
            <ChainExplorer />
          </Box>
          <Box hidden={currentTabIndex !== 1}>
            <BlockExplorer />
          </Box>
          <Box hidden={currentTabIndex !== 2}>
            <EventExplorer />
          </Box>
        </SwipeableViews>
      </Box>
    </>
  );
}
