import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, {
  Context,
  createContext,
  Dispatch,
  memo,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Children } from './types';

interface ErrorContextProps {
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
}

export const ErrorContext: Context<ErrorContextProps> = createContext(
  ({} as unknown) as ErrorContextProps
);

function Error({ children }: Children): ReactElement<Children> {
  const [error, setError] = useState<Error | null>(null);
  const [showError, setErrorVisible] = useState<boolean>(false);

  const handleClose = () => {
    setError(null);
    setErrorVisible(false);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
      setErrorVisible(true);
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={showError}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {error?.message}
          </Alert>
        </Snackbar>
        {children}
      </>
    </ErrorContext.Provider>
  );
}

export default memo(Error);

export const useError = (): ErrorContextProps => useContext(ErrorContext);
