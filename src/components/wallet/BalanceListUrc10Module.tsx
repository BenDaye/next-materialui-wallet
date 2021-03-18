import { memo, ReactElement } from 'react';
import type { BaseProps } from '@@/types';

interface BalanceListUrc10ModuleProps extends BaseProps {}

function BalanceListUrc10Module({
  children,
}: BalanceListUrc10ModuleProps): ReactElement<BalanceListUrc10ModuleProps> {
  return <>{children}</>;
}

export default memo(BalanceListUrc10Module);
