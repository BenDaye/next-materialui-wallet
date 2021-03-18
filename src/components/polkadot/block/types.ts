import type { HeaderExtended } from '@polkadot/api-derive';

export interface BlockAuthorContextProps {
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  lastBlockAuthors: string[];
  lastBlockNumber?: string;
  lastHeader?: HeaderExtended;
  lastHeaders: HeaderExtended[];
}

export type ValidatorContextProps = string[];
