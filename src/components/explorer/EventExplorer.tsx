import { memo, ReactElement, ReactNode } from 'react';

interface Children {
  children?: ReactNode;
}

function EventExplorerProvider({ children }: Children): ReactElement<Children> {
  return <div>{children}</div>;
}

export default memo(EventExplorerProvider);
