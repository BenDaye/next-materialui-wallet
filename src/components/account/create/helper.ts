export function randomMnemonic(mnemonic?: string): string[] {
  return mnemonic ? mnemonic.split(' ').sort(() => Math.random() - 0.5) : [];
}
