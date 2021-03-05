export function shortAddress(address?: string | null): string | null {
  if (!address) return null;
  return address.length > 13
    ? `${address.slice(0, 6)}...${address.slice(-6)}`
    : address;
}
