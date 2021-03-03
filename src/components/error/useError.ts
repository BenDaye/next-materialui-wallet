import { useContext } from 'react';
import { ErrorContext, ErrorContextProps } from './ErrorContext';

export const useError = (): ErrorContextProps => useContext(ErrorContext);
