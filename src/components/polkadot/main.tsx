import type { BaseProps } from '@@/types';
import {
  TransactionDialogProvider,
  TransactionStatusProvider,
} from '@components/transaction';
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

interface PolkadotProviderProps extends BaseProps {}

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
                <AddressProvider>
                  <TransactionStatusProvider>
                    <TransactionDialogProvider>
                      {children}
                    </TransactionDialogProvider>
                  </TransactionStatusProvider>
                </AddressProvider>
              </AccountProvider>
            </EventProvider>
          </BlockProvider>
        </ChainProvider>
      </ApiProvider>
    </QueueProvider>
  );
}

export const PolkadotProvider = memo(Polkadot);
