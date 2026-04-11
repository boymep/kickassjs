import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import CodeBlock from './CodeBlock';
import { getTheory } from '../../data/theory';
import type { TheoryBlock } from '../../types/topic';

const vizComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'binary-search': lazy(() => import('../visualizations/BinarySearchViz')),
  'two-pointers': lazy(() => import('../visualizations/TwoPointersViz')),
  'sliding-window': lazy(() => import('../visualizations/SlidingWindowViz')),
  'hash-map': lazy(() => import('../visualizations/HashMapViz')),
  'stacks-queues': lazy(() => import('../visualizations/StackViz')),
  'trees': lazy(() => import('../visualizations/TreeViz')),
};

/** Parse simple inline markdown: **bold**, `code`, and -- → — */
function renderInline(text: string): React.ReactNode[] {
  const normalized = text.replace(/ -- /g, ' — ');
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      parts.push(normalized.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          style={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 4,
            padding: '1px 5px',
            fontSize: '0.88em',
            fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
          }}
        >
          {match[3]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    parts.push(normalized.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [normalized];
}

function stripListPrefix(item: string): string {
  return item.replace(/^[-•*]\s+/, '');
}

function renderBlock(block: TheoryBlock, idx: number) {
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
          {renderInline(block.content)}
        </Typography>
      );
    case 'code':
      return <CodeBlock key={idx} code={block.content} language={block.language} />;
    case 'list':
      return (
        <Box key={idx} component="ul" sx={{ pl: 3, mb: 1 }}>
          {block.content.split('\n').map((item, i) => (
            <li key={i}>
              <Typography variant="body1">{renderInline(stripListPrefix(item))}</Typography>
            </li>
          ))}
        </Box>
      );
    case 'callout':
      return (
        <Alert key={idx} severity={block.calloutType ?? 'info'} sx={{ my: 2 }}>
          {renderInline(block.content)}
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
          {section.blocks.map((block, bi) => renderBlock(block, bi))}
        </Paper>
      ))}
    </Box>
  );
}
