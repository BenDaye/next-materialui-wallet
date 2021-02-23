import { ChainExplorer } from '@components/explorer';
import { AppBar, Box, Tab, Tabs, TextField, Toolbar } from '@material-ui/core';
import React, { useState } from 'react';

export default function Explorer() {
  const [currentTab, setCurrentTab] = useState<string>('chain');
  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Box flexGrow={1}>
            <TextField
              id="query_block"
              placeholder="查询区块(哈希或高度)"
              variant="filled"
              color="secondary"
              fullWidth
              margin="dense"
            />
          </Box>
        </Toolbar>
        <Box flexGrow={1}>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            variant="fullWidth"
            aria-label="Explorer Navigation Tabs"
          >
            <Tab value="chain" label="信息" wrapped />
            <Tab value="block" label="区块" wrapped />
            <Tab value="events" label="事件" wrapped />
          </Tabs>
        </Box>
      </AppBar>
      <ChainExplorer />
    </>
  );
}
