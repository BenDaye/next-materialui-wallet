import { Context, createContext, Dispatch, SetStateAction } from 'react';

export interface ErrorContextProps {
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
}

export const ErrorContext: Context<ErrorContextProps> = createContext(
  ({} as unknown) as ErrorContextProps
);
