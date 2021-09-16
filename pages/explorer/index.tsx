import {
  AppBar,
  Box,
  NoSsr,
  Tab,
  Tabs,
  TextField,
  Toolbar,
} from '@material-ui/core';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

interface SearchForm {
  searchKey: string;
}

export default function ExplorerPage() {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const { register, handleSubmit, errors } = useForm<SearchForm>({
    mode: 'all',
  });
  const router = useRouter();

  const searchKeyValidate = (value: string): true | string => {
    return !Number.isNaN(Number(value)) || '无效的区块号';
  };

  const onSubmit = useCallback(({ searchKey }: SearchForm) => {
    router.push(`/block/${searchKey}`);
  }, []);
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Box flexGrow={1}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="searchKey"
                label={errors.searchKey?.message || '查询区块(哈希或高度)'}
                inputRef={register({ validate: searchKeyValidate })}
                variant="outlined"
                color="secondary"
                fullWidth
                margin="dense"
                error={!!errors.searchKey}
                type="search"
              />
            </form>
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
    </>
  );
}
