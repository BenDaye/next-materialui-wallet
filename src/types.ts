import { MutableRefObject, ReactNode } from 'react';

export type MountedRef = MutableRefObject<boolean>;

export interface BaseProps {
  children?: ReactNode;
}
