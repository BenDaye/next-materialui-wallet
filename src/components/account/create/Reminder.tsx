import React, {
  memo,
  ReactElement,
  useState,
  useMemo,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import type { BaseProps } from '@@/types';
import { useNotice } from '@@/hook';
import {
  AppBar,
  Box,
  Button,
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
import styles from '@styles/Layout.module.css';
import { randomMnemonic } from './helper';

interface CreateAccountReminderProps extends BaseProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mnemonic: {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.primary.main,
    },
  })
);

function Reminder({
  children,
}: CreateAccountReminderProps): ReactElement<CreateAccountReminderProps> | null {
  const { showError } = useNotice();
  const classes = useStyles();
  const { step, setStep, mnemonic } =
    useContext<CreateAccountContextProps>(CreateAccountContext);

  const [randomMnemonicArray, setRandomMnemonicArray] = useState<string[]>(() =>
    randomMnemonic(mnemonic)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const reset = useCallback(() => {
    setSelectedWords([]);
    setRandomMnemonicArray(randomMnemonic(mnemonic));
  }, [mnemonic]);

  const onSelectWord = useCallback(
    (word: string) => {
      setSelectedWords([...selectedWords, word]);
      const _array = [...randomMnemonicArray];
      const index = _array.findIndex((item) => item === word);
      _array.splice(index, 1);
      setRandomMnemonicArray(_array);
    },
    [selectedWords, randomMnemonicArray]
  );

  const isCompleted: boolean = useMemo(
    () => !!mnemonic && !randomMnemonicArray.length && !!selectedWords.length,
    [mnemonic, randomMnemonicArray, selectedWords]
  );

  useEffect(() => {
    if (isCompleted) return;
    setSelectedWords([]);
    setRandomMnemonicArray(randomMnemonic(mnemonic));
  }, [step, mnemonic, isCompleted]);

  const prevStep = useCallback(() => {
    setStep(2);
  }, []);

  const nextStep = useCallback(() => {
    if (selectedWords.join(' ') === mnemonic) {
      setStep(4);
    } else {
      showError('助记词不匹配');
      reset();
    }
  }, [mnemonic, selectedWords]);

  if (step !== 3) return null;
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
            {randomMnemonicArray && !!randomMnemonicArray.length && (
              <Box px={2} py={1}>
                <Box display="flex" flexWrap="wrap">
                  {randomMnemonicArray.map((word: string, index: number) => (
                    <Box key={`word: ${index}`} mr={1} mb={1}>
                      <Chip label={word} onClick={() => onSelectWord(word)} />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            {selectedWords && !!selectedWords.length && (
              <Box px={2} py={1}>
                <Paper variant="outlined" className={classes.mnemonic}>
                  <Box p={1}>
                    <Typography variant="subtitle1">
                      {selectedWords.join(' ')}
                    </Typography>
                  </Box>
                  <Box display="flex">
                    <Box flexGrow={1}></Box>
                    <Button onClick={reset} className={classes.mnemonic}>
                      重置
                    </Button>
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
