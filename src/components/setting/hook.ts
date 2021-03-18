import { useContext } from 'react';
import { SettingContext } from './context';
import { SettingContextProps } from './types';

export const useSetting = (): SettingContextProps =>
  useContext<SettingContextProps>(SettingContext);
