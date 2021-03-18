import { Context, createContext } from 'react';
import { ErrorContextProps } from './types';

export const ErrorContext: Context<ErrorContextProps> = createContext(
  ({} as unknown) as ErrorContextProps
);
