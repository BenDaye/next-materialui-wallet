import React, { memo, ReactElement, useEffect, useState } from 'react';
import { BaseProps } from '../types';
import { useSnackbar } from 'notistack';
import { ErrorContext } from './context';

function Error({ children }: BaseProps): ReactElement<BaseProps> {
  const [error, setError] = useState<Error | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error)
      enqueueSnackbar(error.message || '未知错误', { variant: 'error' });
  }, [error]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}

export const ErrorProvider = memo(Error);
