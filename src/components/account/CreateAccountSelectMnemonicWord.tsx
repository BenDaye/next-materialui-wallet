import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Children } from '@components/types';
import { useApi } from '@components/polkadot/hook';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { AddressState } from './types';
import styles from '@styles/Layout.module.css';

interface CreateAccountSelectMnemonicWordProps extends Children {
  params: AddressState;
  onChangeStep: (step: number) => void;
}

function randomSortWords(seed: string): string[] {
  return seed.split(' ').sort(() => Math.random() - 0.5);
}

function CreateAccountSelectMnemonicWord({
  children,
  params,
  onChangeStep,
}: CreateAccountSelectMnemonicWordProps): ReactElement<CreateAccountSelectMnemonicWordProps> {
  const { api } = useApi();
  const theme = useTheme();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [seedRandomArray, setSeedRandomArray] = useState<string[]>(() =>
    randomSortWords(params.seed)
  );
  const [isWordsMatch, setIsWordsMatch] = useState<boolean>(false);

  const reset = useCallback(() => {
    setSelectedWords([]);
    setSeedRandomArray(randomSortWords(params.seed));
  }, [params]);

  const onSelectWord = useCallback(
    (word: string) => {
      setSelectedWords([...selectedWords, word]);
      const _array = [...seedRandomArray];
      const index = _array.findIndex((item) => item === word);
      _array.splice(index, 1);
      setSeedRandomArray(_array);
    },
    [selectedWords, seedRandomArray]
  );

  const isCompleted: boolean = useMemo(
    () => !!params.seed && !seedRandomArray.length && !!selectedWords.length,
    [params, seedRandomArray, selectedWords]
  );

  useEffect(() => {
    if (isCompleted) {
      setIsWordsMatch(selectedWords.join(' ') === params.seed);
    }
  }, [isCompleted]);

  return (
    <>
      <Paper>
        <List dense>
          <ListItem>
            <ListItemText
              primary="确认助记词"
              secondary="请按正确顺序点击助记词,以确认备份正确."
            />
          </ListItem>
          {seedRandomArray && !!seedRandomArray.length && (
            <Box px={2} py={1}>
              <Card>
                <CardContent>
                  <Box display="flex" flexWrap="wrap">
                    {seedRandomArray.map((word: string, index: number) => (
                      <Box key={`word: ${index}`} mr={1} mb={1}>
                        <Chip label={word} onClick={() => onSelectWord(word)} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
          {selectedWords && !!selectedWords.length && (
            <Box px={2} py={1}>
              <Card style={{ backgroundColor: theme.palette.warning.dark }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedWords.join(' ')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Box flexGrow={1}></Box>
                  <Button onClick={reset}>重置</Button>
                </CardActions>
              </Card>
            </Box>
          )}
        </List>
      </Paper>

      <AppBar
        position="fixed"
        className={styles.bottomNavigation}
        elevation={0}
        color="inherit"
      >
        <Toolbar>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={() => onChangeStep(2)}
          >
            上一步
          </Button>
        </Toolbar>
        <Toolbar>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={() => onChangeStep(4)}
            disabled={!isWordsMatch}
          >
            下一步
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default memo(CreateAccountSelectMnemonicWord);
