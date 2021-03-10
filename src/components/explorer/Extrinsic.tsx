import { KeyedEvent } from '@components/polkadot/context';
import { Children } from '@components/types';
import type {
  BlockNumber,
  Extrinsic as ExtrinsicType,
} from '@polkadot/types/interfaces';
import React, { memo, ReactElement, useMemo } from 'react';
import { formatNumber } from '@polkadot/util';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@material-ui/core';
import MenuDownIcon from 'mdi-material-ui/MenuDown';
import type { FunctionMetadataLatest } from '@polkadot/types/interfaces/metadata';
import CardContentItemValue from './CardContentItemValue';

interface ExtrinsicProps extends Children {
  index: number;
  blockNumber?: BlockNumber;
  events?: KeyedEvent[];
  extrinsic: ExtrinsicType;
}

function getEra(
  { era }: ExtrinsicType,
  blockNumber?: BlockNumber
): [number, number] | null {
  if (blockNumber && era.isMortalEra) {
    const mortalEra = era.asMortalEra;

    return [
      mortalEra.birth(blockNumber.toNumber()),
      mortalEra.death(blockNumber.toNumber()),
    ];
  }

  return null;
}

function filterEvents(index: number, events: KeyedEvent[] = []): KeyedEvent[] {
  return events.filter(
    ({ record: { phase } }) =>
      phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
  );
}

function splitSingle(value: string[], sep: string): string[] {
  return value.reduce((result: string[], value: string): string[] => {
    return value
      .split(sep)
      .reduce(
        (result: string[], value: string) => result.concat(value),
        result
      );
  }, []);
}

function splitParts(value: string): string[] {
  return ['[', ']'].reduce(
    (result: string[], sep) => splitSingle(result, sep),
    [value]
  );
}

function formatMeta(meta?: FunctionMetadataLatest): React.ReactNode | null {
  if (!meta || !meta.documentation.length) {
    return null;
  }

  const strings = meta.documentation.map((doc) => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc) => !doc.length);
  const combined = (firstEmpty === -1 ? strings : strings.slice(0, firstEmpty))
    .join(' ')
    .replace(/#(<weight>| <weight>).*<\/weight>/, '');
  const parts = splitParts(combined.replace(/\\/g, '').replace(/`/g, ''));

  return (
    <>
      {parts.map((part, index) =>
        index % 2 ? (
          <em key={index}>[{part}]</em>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
      &nbsp;
    </>
  );
}

function Extrinsic({
  children,
  index,
  blockNumber,
  events,
  extrinsic,
}: ExtrinsicProps): ReactElement<ExtrinsicProps> {
  const { meta, method, section } = useMemo(
    () => extrinsic.registry.findMetaCall(extrinsic.callIndex),
    [extrinsic]
  );

  const mortality = useMemo((): string | undefined => {
    if (extrinsic.isSigned) {
      const era = getEra(extrinsic, blockNumber);

      return era
        ? `存在的, 起始 #{${formatNumber(era[0])}} 直至 #{${formatNumber(
            era[1]
          )}}`
        : '持续的';
    }

    return undefined;
  }, [blockNumber, extrinsic]);

  const thisEvents = useMemo(() => filterEvents(index, events), [
    index,
    events,
  ]);

  const headerMain = useMemo(() => formatMeta(meta), [meta]);

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<MenuDownIcon />}
          aria-controls="extrinsic-content"
        >
          <Box>
            <Typography variant="subtitle2">
              {section}.{method}
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              {headerMain}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box width={1}>
            <Typography variant="subtitle2">哈希</Typography>
            <CardContentItemValue value={extrinsic.hash.toHex()} />
            {mortality && (
              <>
                <Typography variant="subtitle2">生命周期</Typography>
                <CardContentItemValue value={mortality} />
              </>
            )}
            {thisEvents.map(({ key, record }) => (
              <Accordion key={key}>
                <AccordionSummary expandIcon={<MenuDownIcon />}>
                  <Box>
                    <Typography variant="subtitle2">
                      {record.event.section}.{record.event.method}
                    </Typography>
                    <CardContentItemValue
                      value={record.event.meta.documentation[0].toString()}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box width={1} overflow="hidden" textOverflow="ellipsis">
                    {record.event.toString()}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            {extrinsic.isSigned && (
              <>
                <Typography variant="subtitle2">签名人</Typography>
                <CardContentItemValue value={extrinsic.signer.toString()} />
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      {children}
    </>
  );
}

export default memo(Extrinsic);
