import { BaseProps } from '@@/types';
import { ImportAddressDialog } from '@components/address';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { AddressContext } from './context';
import {
  getAddresses,
  saveAddress,
  activateAddress as activate,
  deleteAddress as remove,
} from './helper';
import {
  ActivateAddressParams,
  AddressContextProps,
  AddressProps,
  AddressState,
  DeleteAddressParams,
  GetAddressParams,
} from './types';

const Address = ({ children }: BaseProps): ReactElement<BaseProps> => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [{ addresses, hasAddress, isAddress }, setState] =
    useState<AddressState>({
      addresses: [],
      hasAddress: false,
      isAddress: () => false,
    });

  const importAddress = () => setShowDialog(true);

  const activateAddress = (params: ActivateAddressParams) => {
    activate(params);
    updateAllAddresses();
  };

  const deleteAddress = (params: DeleteAddressParams) => {
    remove(params);
    updateAllAddresses();
  };

  const updateAddress = (address: AddressProps) => {
    saveAddress(address);
    updateAllAddresses();
  };

  const updateAddresses = (addresses: AddressProps[]) => {
    addresses.forEach((address) => saveAddress(address));
    updateAllAddresses();
  };

  const updateAllAddresses = () => {
    const _addresses = getAddresses({});
    setState({
      addresses: _addresses,
      hasAddress: _addresses.length > 0,
      isAddress: (value: string): boolean =>
        _addresses.some((v) => v.address === value),
    });
  };

  useEffect(() => {
    updateAllAddresses();
  }, []);

  const handleClose = () => {
    setShowDialog(false);
    updateAllAddresses();
  };

  const value = useMemo<AddressContextProps>(
    () => ({
      addresses,
      hasAddress,
      isAddress,
      importAddress,
      activateAddress,
      deleteAddress,
      updateAddress,
      updateAddresses,
      updateAllAddresses,
    }),
    [addresses, hasAddress]
  );

  return (
    <AddressContext.Provider value={value}>
      {children}
      <ImportAddressDialog show={showDialog} onClose={handleClose} />
    </AddressContext.Provider>
  );
};

export const AddressProvider = memo(Address);
