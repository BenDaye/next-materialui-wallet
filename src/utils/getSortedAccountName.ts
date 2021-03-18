import { AccountBaseProps } from '@components/polkadot/account/types';
import { assert } from '@polkadot/util';

export function getSortedAccountName(account: AccountBaseProps) {
  assert(account, 'ACCOUNT_REQUIRED');
  return `${account.isDevelopment ? '[TEST] ' : ''}${uppercase(account.name)}`;
}

export function uppercase(name?: string) {
  return name ? name.toUpperCase() : '<UNKNOWN>';
}
