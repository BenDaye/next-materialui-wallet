import { Dispatch, SetStateAction } from 'react';

export interface ErrorContextProps {
  error: Error | null;
  setError: Dispatch<SetStateAction<Error | null>>;
}

export interface ErrorProps {
  error: Error | null;
  time: number;
  shown: boolean;
}
