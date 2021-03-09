export function getShortAddress(address?: string | null): string {
  if (!address) return '';
  return address.length > 13
    ? `${address.slice(0, 6)}...${address.slice(-6)}`
    : address;
}
