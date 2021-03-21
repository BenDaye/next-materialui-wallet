import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import type { BaseProps } from '@@/types';
import { useChain, useNotice } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  createStyles,
  Fade,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { CreateAccountContextProps } from './types';
import { CreateAccountContext } from './context';
import { Skeleton } from '@material-ui/lab';
import styles from '@styles/Layout.module.css';
import { randomSeed } from './helper';

interface CreateAccountReminderProps extends BaseProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    seed: {
      backgroundColor: theme.palette.error.dark,
    },
  })
);

function Reminder({
  children,
}: CreateAccountReminderProps): ReactElement<CreateAccountReminderProps> | null {
  const { isChainReady } = useChain();
  const { showError } = useNotice();
  const classes = useStyles();
  const { step, setStep, seed } = useContext<CreateAccountContextProps>(
    CreateAccountContext
  );

  const [randomSeedArray, setRandomSeedArray] = useState<string[]>(() =>
    randomSeed(seed)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const reset = useCallback(() => {
    setSelectedWords([]);
    setRandomSeedArray(randomSeed(seed));
  }, [seed]);

  const onSelectWord = useCallback(
    (word: string) => {
      setSelectedWords([...selectedWords, word]);
      const _array = [...randomSeedArray];
      const index = _array.findIndex((item) => item === word);
      _array.splice(index, 1);
      setRandomSeedArray(_array);
    },
    [selectedWords, randomSeedArray]
  );

  const isCompleted: boolean = useMemo(
    () => !!seed && !randomSeedArray.length && !!selectedWords.length,
    [seed, randomSeedArray, selectedWords]
  );

  const prevStep = useCallback(() => {
    setStep(2);
  }, []);

  const nextStep = useCallback(() => {
    if (selectedWords.join(' ') === seed) {
      setStep(4);
    } else {
      showError('助记词不匹配');
      reset();
    }
  }, [seed, selectedWords]);

  if (!(step === 3 && isChainReady)) return null;
  return (
    <Fade in={step === 3}>
      <Container>
        <Paper>
          <List dense>
            <ListItem>
              <ListItemText
                primary="确认助记词"
                secondary="请按正确顺序点击助记词，以确认备份正确。"
              />
            </ListItem>
            {randomSeedArray && !!randomSeedArray.length && (
              <Box px={2} py={1}>
                <Box display="flex" flexWrap="wrap">
                  {randomSeedArray.map((word: string, index: number) => (
                    <Box key={`word: ${index}`} mr={1} mb={1}>
                      <Chip label={word} onClick={() => onSelectWord(word)} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {selectedWords && !!selectedWords.length && (
              <Box px={2} py={1}>
                <Paper variant="outlined" className={classes.seed}>
                  <Box p={1}>
                    <Typography variant="subtitle1">
                      {selectedWords.join(' ')}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Box flexGrow={1}></Box>
                    <Button onClick={reset}>重置</Button>
                  </Box>
                </Paper>
              </Box>
            )}
          </List>
        </Paper>
        {children}
        <Toolbar />
        <Toolbar />
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
              onClick={prevStep}
            >
              上一步
            </Button>
          </Toolbar>
          <Toolbar>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={nextStep}
              disabled={!isCompleted}
            >
              下一步
            </Button>
          </Toolbar>
        </AppBar>
      </Container>
    </Fade>
  );
}

export const CreateAccountReminder = memo(Reminder);
