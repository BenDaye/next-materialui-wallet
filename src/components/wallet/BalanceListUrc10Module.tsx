import { memo, ReactElement } from 'react';
import { Children } from '@components/types';

interface BalanceListUrc10ModuleProps extends Children {}

function BalanceListUrc10Module({
  children,
}: BalanceListUrc10ModuleProps): ReactElement<BalanceListUrc10ModuleProps> {
  return <>{children}</>;
}

export default memo(BalanceListUrc10Module);
