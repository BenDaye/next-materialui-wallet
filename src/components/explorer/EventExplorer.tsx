import { Children } from '@components/types';
import { memo, ReactElement } from 'react';

interface EventExplorerProps extends Children {}

function EventExplorerProvider({
  children,
}: EventExplorerProps): ReactElement<EventExplorerProps> {
  return (
    <>
      <div>
        <code></code>
      </div>
      {children}
    </>
  );
}

export default memo(EventExplorerProvider);
