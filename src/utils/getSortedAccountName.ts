import { SortedAccount } from '@components/polkadot/context';
import { assert } from '@polkadot/util';

export function getSortedAccountName(account: SortedAccount) {
  assert(account, 'ACCOUNT_REQUIRED');
  return `${account.isDevelopment ? '[TEST] ' : ''}${uppercase(
    account.account.meta.name
  )}`;
}

export function uppercase(name?: string) {
  return name ? name.toUpperCase() : '<UNKNOWN>';
}
