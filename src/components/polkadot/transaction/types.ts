export interface TransfersResponse {
  success: boolean;
  result: TransfersResponseResult;
}

export interface TransfersResponseResult {
  count: number;
  docs: TransferProps[];
}

export interface TransferProps {
  owner: string; // "5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAe",
  counterparty: string; // "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  direction: number; // 1: out, 2: in,
  amount: string; // "200000000000",
  exHash: string; // "0xa2048b990e50b163e2069d07a182741a83a6ed395655da367cde1222390d520a",
  blockNumber: number; // 12,
  type: string; // "native",
  symbol: string; // "UECC",
  _id: string; // "ZFay5oqAVg3xyywH",
}

export interface GetTransferParams {
  owner?: string | null;
  symbol?: string | null;
  counterparty?: string | null;
  direction?: number | null;
}
