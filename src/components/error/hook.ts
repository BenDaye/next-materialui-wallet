import { useContext } from 'react';
import { ErrorContext } from './context';
import { ErrorContextProps } from './types';

export const useError = (): ErrorContextProps =>
  useContext<ErrorContextProps>(ErrorContext);
