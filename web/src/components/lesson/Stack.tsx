import { Stack as MuiStack } from '@mui/material';
import type { ComponentProps, ReactNode } from 'react';

type ShimProps = Omit<ComponentProps<typeof MuiStack>, 'component' | 'children'> & {
  children?: ReactNode;
  direction?: 'row' | 'column' | { xs?: 'row' | 'column'; sm?: 'row' | 'column'; md?: 'row' | 'column' };
  spacing?: number | string;
  alignItems?: string | { xs?: string; sm?: string; md?: string };
  justifyContent?: string;
  flexWrap?: 'wrap' | 'nowrap';
};

/**
 * MUI v9 made `component` a required prop on Stack at the typing level (regression).
 * This thin wrapper supplies `component="div"` and re-types the common flex props
 * we actually use, so call sites stay clean.
 */
export default function Stack(props: ShimProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <MuiStack component="div" {...(props as any)} />;
}
