import {
  Authors,
  BlockAuthorsContext,
  ValidatorsContext,
} from '@components/polkadot/context';
import { useContext } from 'react';

export const useBlockAuthors = (): Authors => useContext(BlockAuthorsContext);

export const useValidators = (): string[] => useContext(ValidatorsContext);
