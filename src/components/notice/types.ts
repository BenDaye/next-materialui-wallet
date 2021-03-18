import { OptionsObject, SnackbarKey } from 'notistack';

export interface NoticeContextProps {
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
