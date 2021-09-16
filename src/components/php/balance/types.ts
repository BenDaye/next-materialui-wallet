export interface BalanceProps {
  address: string;
  balance_int: string;
  decimals: string;
  balance: string;
}

export interface GetBalanceParams {
  chain_type: string;
  uuid: string;
  address: string;
}
