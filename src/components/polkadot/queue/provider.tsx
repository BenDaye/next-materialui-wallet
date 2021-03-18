import type { BaseProps } from '@@/types';
import { memo, ReactElement } from 'react';
import { QueueContext } from './context';
import { useQueueSubscription } from './hook';

interface QueueProviderProps extends BaseProps {}

function Queue({
  children,
}: QueueProviderProps): ReactElement<QueueProviderProps> {
  const value = useQueueSubscription();

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export const QueueProvider = memo(Queue);
