import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Alert, CircularProgress, useTheme } from '@mui/material';
import CodeBlock from './CodeBlock';
import { getTheory } from '../../data/theory';
import type { TheoryBlock } from '../../types/topic';
import { renderInline } from '../../utils/renderInline';

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

function renderBlock(block: TheoryBlock, idx: number, ri: (t: string) => React.ReactNode[]) {
  switch (block.type) {
    case 'heading':
      return (
        <Typography key={idx} variant="h5" sx={{ mt: 3, mb: 1 }}>
          {block.content}
        </Typography>
      );
    case 'text':
      return (
        <Typography key={idx} variant="body1" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
          {ri(block.content)}
        </Typography>
      );
    case 'code':
      return <CodeBlock key={idx} code={block.content} language={block.language} />;
    case 'list':
      return (
        <Box key={idx} component="ul" sx={{ pl: 3, mb: 1 }}>
          {block.content.split('\n').map((item, i) => (
            <li key={i}>
              <Typography variant="body1">{ri(stripListPrefix(item))}</Typography>
            </li>
          ))}
        </Box>
      );
    case 'callout':
      return (
        <Alert key={idx} severity={block.calloutType === 'tip' ? 'success' : (block.calloutType ?? 'info')} sx={{ my: 2 }}>
          {ri(block.content)}
        </Alert>
      );
    case 'visualization': {
      const VizComponent = block.vizId ? vizComponents[block.vizId] : null;
      if (!VizComponent) return null;
      return (
        <Box key={idx} sx={{ my: 2 }}>
          <Suspense fallback={<CircularProgress size={24} />}>
            <VizComponent />
          </Suspense>
        </Box>
      );
    }
    default:
      return null;
  }
}

export default function TheoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const theory = getTheory(slug ?? '');
  const theme = useTheme();
  const ri = (text: string) => renderInline(text, theme.palette.mode === 'dark');

  if (!theory) {
    return <Typography>Теория не найдена</Typography>;
  }

  return (
    <Box>
      {theory.sections.map((section, si) => (
        <Paper key={si} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {section.title}
          </Typography>
          {section.blocks.map((block, bi) => renderBlock(block, bi, ri))}
        </Paper>
      ))}
    </Box>
  );
}
