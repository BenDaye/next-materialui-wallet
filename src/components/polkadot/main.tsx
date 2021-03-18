import type { Children } from '@components/types';
import { memo, ReactElement } from 'react';
import {
  QueueProvider,
  ApiProvider,
  AccountProvider,
  AddressProvider,
  BlockProvider,
  ChainProvider,
  EventProvider,
} from './provider';

interface PolkadotProviderProps extends Children {}

function Polkadot({
  children,
}: PolkadotProviderProps): ReactElement<PolkadotProviderProps> {
  return (
    <QueueProvider>
      <ApiProvider>
        <ChainProvider>
          <BlockProvider>
            <EventProvider>
              <AccountProvider>
                <AddressProvider>{children}</AddressProvider>
              </AccountProvider>
            </EventProvider>
          </BlockProvider>
        </ChainProvider>
      </ApiProvider>
    </QueueProvider>
  );
}

export const PolkadotProvider = memo(Polkadot);
