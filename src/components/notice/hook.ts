import { useContext } from 'react';
import { NoticeContext } from './context';
import { NoticeContextProps } from './types';

export const useNotice = (): NoticeContextProps =>
  useContext<NoticeContextProps>(NoticeContext);
