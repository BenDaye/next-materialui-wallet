import type { Text } from '@polkadot/types';

export interface Meta {
  documentation: Text[];
}

export function splitSingle(value: string[], sep: string): string[] {
  return value.reduce((result: string[], value: string): string[] => {
    return value
      .split(sep)
      .reduce(
        (result: string[], value: string) => result.concat(value),
        result
      );
  }, []);
}

export function splitParts(value: string): string[] {
  return ['[', ']'].reduce(
    (result: string[], sep) => splitSingle(result, sep),
    [value]
  );
}

export function formatMeta(meta?: Meta): string[] | null {
  if (!meta || !meta.documentation.length) {
    return null;
  }

  const strings = meta.documentation.map((doc) => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc) => !doc.length);
  const combined = (firstEmpty === -1 ? strings : strings.slice(0, firstEmpty))
    .join(' ')
    .replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return parts;
}
