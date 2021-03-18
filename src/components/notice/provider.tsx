import { BaseProps } from '@@/types';
import { OptionsObject, SnackbarKey, useSnackbar } from 'notistack';
import { memo, ReactElement, useCallback } from 'react';
import { NoticeContext } from './context';

interface NoticeProps extends BaseProps {}

function Notice({ children }: NoticeProps): ReactElement<NoticeProps> {
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
      <NoticeContext.Provider
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
      </NoticeContext.Provider>
    </>
  );
}

export const NoticeProvider = memo(Notice);
