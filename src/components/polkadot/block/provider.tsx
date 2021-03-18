import { Children } from '@components/types';
import { memo, ReactElement } from 'react';
import { BlockAuthorContext, ValidatorContext } from './context';
import { useBlockAuthorSubscription, useValidatorSubscription } from './hook';

interface BlockProviderProps extends Children {}

function Block({
  children,
}: BlockProviderProps): ReactElement<BlockProviderProps> {
  const blockAuthor = useBlockAuthorSubscription();
  const validator = useValidatorSubscription();

  return (
    <ValidatorContext.Provider value={validator}>
      <BlockAuthorContext.Provider value={blockAuthor}>
        {children}
      </BlockAuthorContext.Provider>
    </ValidatorContext.Provider>
  );
}

export const BlockProvider = memo(Block);
