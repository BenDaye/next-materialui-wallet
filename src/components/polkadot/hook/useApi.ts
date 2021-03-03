import { useContext } from 'react';
import { ApiContext, ApiProps } from '@components/polkadot/context';

export const useApi = (): ApiProps => useContext(ApiContext);
