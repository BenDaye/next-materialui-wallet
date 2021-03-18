import { OptionsObject, SnackbarKey } from 'notistack';
import { Context, createContext } from 'react';
import { NoticeContextProps } from './types';

export const NoticeContext: Context<NoticeContextProps> = createContext<NoticeContextProps>(
  {
    show: (message: string, options?: OptionsObject | undefined) => 0,
    showError: (message: string, options?: OptionsObject | undefined) => 0,
    showSuccess: (message: string, options?: OptionsObject | undefined) => 0,
    showWarning: (message: string, options?: OptionsObject | undefined) => 0,
    showInfo: (message: string, options?: OptionsObject | undefined) => 0,
    close: (key?: SnackbarKey) => {},
  }
);
