import { useContext } from 'react';
import { ApiContext } from './context';
import type { ApiContextProps } from './types';

export const useApi = (): ApiContextProps =>
  useContext<ApiContextProps>(ApiContext);
