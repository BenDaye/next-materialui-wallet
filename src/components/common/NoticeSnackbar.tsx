import {
  Context,
  createContext,
  memo,
  ReactElement,
  useCallback,
  useContext,
} from 'react';
import type { Children } from '@components/types';
import { useSnackbar, OptionsObject, SnackbarKey } from 'notistack';

interface NoticeSnackbarProps extends Children {}

export interface NoticeSnackbarContextProps {
  show: (message: string, options?: OptionsObject | undefined) => SnackbarKey;
  showError: (
    message: string,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  showSuccess: (
    message: string,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  showWarning: (
    message: string,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  showInfo: (
    message: string,
    options?: OptionsObject | undefined
  ) => SnackbarKey;
  close: (key?: SnackbarKey) => void;
}

export const NoticeSnackbarContext: Context<NoticeSnackbarContextProps> = createContext<NoticeSnackbarContextProps>(
  {
    show: (message: string, options?: OptionsObject | undefined) => 0,
    showError: (message: string, options?: OptionsObject | undefined) => 0,
    showSuccess: (message: string, options?: OptionsObject | undefined) => 0,
    showWarning: (message: string, options?: OptionsObject | undefined) => 0,
    showInfo: (message: string, options?: OptionsObject | undefined) => 0,
    close: (key?: SnackbarKey) => {},
  }
);

function NoticeSnackbar({
  children,
}: NoticeSnackbarProps): ReactElement<NoticeSnackbarProps> {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const show = useCallback(
    (message: string, options?: OptionsObject | undefined): SnackbarKey =>
      enqueueSnackbar(message, options),
    []
  );
  const showError = useCallback(
    (message: string, options?: OptionsObject | undefined): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'error', ...options }),
    []
  );
  const showSuccess = useCallback(
    (message: string, options?: OptionsObject | undefined): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'success', ...options }),
    []
  );
  const showWarning = useCallback(
    (message: string, options?: OptionsObject | undefined): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'warning', ...options }),
    []
  );
  const showInfo = useCallback(
    (message: string, options?: OptionsObject | undefined): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'info', ...options }),
    []
  );

  const close = useCallback(
    (key?: SnackbarKey): void => closeSnackbar(key),
    []
  );
  return (
    <>
      <NoticeSnackbarContext.Provider
        value={{
          show,
          showError,
          showSuccess,
          showWarning,
          showInfo,
          close,
        }}
      >
        {children}
      </NoticeSnackbarContext.Provider>
    </>
  );
}

export const NoticeSnackBarProvider = memo(NoticeSnackbar);

export const useNotice = (): NoticeSnackbarContextProps =>
  useContext<NoticeSnackbarContextProps>(NoticeSnackbarContext);
