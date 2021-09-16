import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from '@material-ui/core';
import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BaseProps } from '../../types';
import { ErrorContext } from './context';
import { ErrorProps } from './types';

function Error({ children }: BaseProps): ReactElement<BaseProps> {
  const [error, setError] = useState<Error | null>(null);
  const [errorQueue, setErrorQueue] = useState<ErrorProps[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (error)
      setErrorQueue([{ error, time: Date.now(), shown: false }, ...errorQueue]);
  }, [error]);

  const nextError = useMemo<ErrorProps | undefined>(
    () => errorQueue.find((e) => !e.shown),
    [errorQueue]
  );

  useEffect(() => {
    if (nextError) setOpen(true);
    else setOpen(false);
  }, [nextError]);

  const handleClose = (_: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') return;
  };

  const handleConfirm = useCallback(() => {
    setOpen(false);
    if (nextError) {
      setErrorQueue(
        errorQueue.map((e) =>
          e.time === nextError.time ? { ...e, shown: true } : e
        )
      );
    }
  }, [nextError]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <Typography variant="body2" className="word-break">
            {nextError?.error?.message || ' '}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="default">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorContext.Provider>
  );
}

export const ErrorProvider = memo(Error);
