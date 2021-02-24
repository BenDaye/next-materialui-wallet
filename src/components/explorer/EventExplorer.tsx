import { Children } from '@components/types';
import { memo, ReactElement } from 'react';
import { Response } from '../../../pages/explorer/index';

interface EventExplorerProps extends Children {
  data?: Response;
}

function EventExplorerProvider({
  children,
  data,
}: EventExplorerProps): ReactElement<EventExplorerProps> {
  return (
    <>
      <div>
        <code>{JSON.stringify(data)}</code>
      </div>
      {children}
    </>
  );
}

export default memo(EventExplorerProvider);
