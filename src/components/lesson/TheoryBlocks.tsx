import { lazy, Suspense } from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CodeBlock from '../theory/CodeBlock';
import { renderInline } from '../../utils/renderInline';
import type { TheoryBlock } from '../../types/topic';

const vizComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'binary-search': lazy(() => import('../visualizations/BinarySearchViz')),
  'two-pointers': lazy(() => import('../visualizations/TwoPointersViz')),
  'sliding-window': lazy(() => import('../visualizations/SlidingWindowViz')),
  'hash-map': lazy(() => import('../visualizations/HashMapViz')),
  'frequency-count': lazy(() => import('../visualizations/FrequencyCountViz')),
  'two-sum-lookup': lazy(() => import('../visualizations/TwoSumLookupViz')),
  'fixed-window': lazy(() => import('../visualizations/FixedWindowViz')),
  'dynamic-window': lazy(() => import('../visualizations/DynamicWindowViz')),
  'stacks-queues': lazy(() => import('../visualizations/StackViz')),
  'queue': lazy(() => import('../visualizations/QueueViz')),
  'monotonic-stack': lazy(() => import('../visualizations/MonotonicStackViz')),
  'trees': lazy(() => import('../visualizations/TreeViz')),
  'dfs': lazy(() => import('../visualizations/DfsViz')),
  'bfs': lazy(() => import('../visualizations/BfsViz')),
  'binary-search-answer': lazy(() => import('../visualizations/BinarySearchAnswerViz')),
  'converging-pointers': lazy(() => import('../visualizations/ConvergingPointersViz')),
  'parallel-pointers': lazy(() => import('../visualizations/ParallelPointersViz')),
  'event-loop': lazy(() => import('../visualizations/EventLoopViz')),
  'node-event-loop': lazy(() => import('../visualizations/NodeEventLoopViz')),
  'prototype-chain': lazy(() => import('../visualizations/PrototypeChainViz')),
  'closure-scope': lazy(() => import('../visualizations/ClosureScopeViz')),
};

function stripListPrefix(item: string): string {
  return item.replace(/^[-•*]\s+/, '');
}

const CALLOUT_STYLES = {
  info: {
    color: '#0a84ff',
    bg: { light: 'rgba(10,132,255,0.06)', dark: 'rgba(10,132,255,0.12)' },
    border: { light: 'rgba(10,132,255,0.25)', dark: 'rgba(10,132,255,0.35)' },
    Icon: InfoOutlinedIcon,
    label: 'Важно',
  },
  tip: {
    color: '#34c759',
    bg: { light: 'rgba(52,199,89,0.06)', dark: 'rgba(52,199,89,0.12)' },
    border: { light: 'rgba(52,199,89,0.25)', dark: 'rgba(52,199,89,0.35)' },
    Icon: LightbulbOutlinedIcon,
    label: 'Совет',
  },
  warning: {
    color: '#ff9500',
    bg: { light: 'rgba(255,149,0,0.07)', dark: 'rgba(255,149,0,0.14)' },
    border: { light: 'rgba(255,149,0,0.3)', dark: 'rgba(255,149,0,0.4)' },
    Icon: WarningAmberOutlinedIcon,
    label: 'Ловушка',
  },
  success: {
    color: '#34c759',
    bg: { light: 'rgba(52,199,89,0.06)', dark: 'rgba(52,199,89,0.12)' },
    border: { light: 'rgba(52,199,89,0.25)', dark: 'rgba(52,199,89,0.35)' },
    Icon: CheckCircleOutlinedIcon,
    label: 'Готово',
  },
} as const;

type CalloutKey = keyof typeof CALLOUT_STYLES;

interface TheoryBlocksProps {
  blocks: TheoryBlock[];
}

export default function TheoryBlocks({ blocks }: TheoryBlocksProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const ri = (text: string) => renderInline(text, isDark);

  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <Typography
                key={idx}
                variant="h6"
                sx={{ mt: 3, mb: 1.5, fontSize: '1.15rem', fontWeight: 600 }}
              >
                {block.content}
              </Typography>
            );
          case 'text':
            return (
              <Typography
                key={idx}
                variant="body1"
                sx={{
                  mb: 2,
                  whiteSpace: 'pre-line',
                  lineHeight: 1.35,
                  color: 'text.primary',
                }}
              >
                {ri(block.content)}
              </Typography>
            );
          case 'code':
            return (
              <Box key={idx} sx={{ mb: 2 }}>
                <CodeBlock code={block.content} language={block.language} />
              </Box>
            );
          case 'list':
            return (
              <Box
                key={idx}
                component="ul"
                sx={{
                  pl: 0,
                  mb: 2,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.35,
                }}
              >
                {block.content.split('\n').map((item, i) => (
                  <Box
                    key={i}
                    component="li"
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.25,
                      '&::before': {
                        content: '""',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        flexShrink: 0,
                        mt: '11px',
                      },
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.35 }}>
                      {ri(stripListPrefix(item))}
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          case 'callout': {
            const key = (block.calloutType ?? 'info') as CalloutKey;
            const style = CALLOUT_STYLES[key] ?? CALLOUT_STYLES.info;
            const Icon = style.Icon;
            return (
              <Box
                key={idx}
                sx={{
                  my: 3,
                  p: 2,
                  borderRadius: 2,
                  borderLeft: 3,
                  borderColor: style.color,
                  backgroundColor: isDark ? style.bg.dark : style.bg.light,
                  display: 'flex',
                  gap: 1.5,
                }}
              >
                <Icon sx={{ color: style.color, fontSize: 22, flexShrink: 0, mt: '2px' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: style.color,
                      fontWeight: 700,
                      lineHeight: 1,
                      mb: 1.25,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {style.label}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: '1.35 !important', color: 'text.primary' }}>
                    {ri(block.content)}
                  </Typography>
                </Box>
              </Box>
            );
          }
          case 'visualization': {
            const VizComponent = block.vizId ? vizComponents[block.vizId] : null;
            if (!VizComponent) return null;
            return (
              <Box key={idx} sx={{ my: 3 }}>
                <Suspense fallback={<CircularProgress size={24} />}>
                  <VizComponent />
                </Suspense>
              </Box>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
