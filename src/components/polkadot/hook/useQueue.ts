import { QueueContext, QueueProps } from '@components/polkadot/context';
import { useContext } from 'react';

export const useQueue = (): QueueProps => useContext(QueueContext);
