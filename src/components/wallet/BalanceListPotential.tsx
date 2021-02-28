import { memo, ReactElement } from 'react';
import { Children } from '@components/types';

interface BalanceListPotentialProps extends Children {}

function BalanceListPotential({
  children,
}: BalanceListPotentialProps): ReactElement<BalanceListPotentialProps> {
  return <>{children}</>;
}

export default memo(BalanceListPotential);
