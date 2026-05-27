import ReactMarkdown from 'react-markdown';
import { Alert, Box, Link, Typography, useTheme } from '@mui/material';
import CodeBlock from '../theory/CodeBlock';

interface MarkdownProps {
  children: string;
  /** Disable wrapping paragraphs in <Typography variant="body1">. Useful inside compact layouts. */
  compact?: boolean;
}

/**
 * Full markdown renderer for long-form prose with consistent typography, code blocks,
 * and link styling. Use this for lesson intros, interview answers, and cheatsheets.
 * For short inline strings prefer renderInline.
 */
export default function Markdown({ children, compact = false }: MarkdownProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        '& > :first-of-type': { mt: 0 },
        '& > :last-child': { mb: 0 },
      }}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => <Typography variant="h5" sx={{ mt: 3, mb: 1.5 }}>{children}</Typography>,
          h2: ({ children }) => <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>{children}</Typography>,
          h3: ({ children }) => <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>{children}</Typography>,
          p: ({ children }) =>
            compact ? (
              <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.3 }}>{children}</Typography>
            ) : (
              <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.35 }}>{children}</Typography>
            ),
          ul: ({ children }) => <Box component="ul" sx={{ pl: 3, mb: 1.5 }}>{children}</Box>,
          ol: ({ children }) => <Box component="ol" sx={{ pl: 3, mb: 1.5 }}>{children}</Box>,
          li: ({ children }) => (
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant={compact ? 'body2' : 'body1'} component="span">{children}</Typography>
            </Box>
          ),
          a: ({ href, children }) => (
            <Link href={href} target="_blank" rel="noreferrer noopener" underline="hover">{children}</Link>
          ),
          blockquote: ({ children }) => (
            <Alert severity="info" variant="outlined" sx={{ my: 1.5 }}>
              {children}
            </Alert>
          ),
          code: ({ className, children, ...rest }) => {
            const text = String(children ?? '').replace(/\n$/, '');
            const langMatch = /language-([\w-]+)/.exec(className ?? '');
            const isBlock = !!langMatch || text.includes('\n');
            if (isBlock) {
              return (
                <Box sx={{ mb: 2 }}>
                  <CodeBlock code={text} language={langMatch?.[1] ?? 'javascript'} />
                </Box>
              );
            }
            return (
              <Box
                component="code"
                sx={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                  borderRadius: 0.5,
                  px: 0.6,
                  py: 0.1,
                  fontSize: '0.88em',
                  fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
                }}
                {...rest}
              >
                {children}
              </Box>
            );
          },
          // react-markdown v10 wraps `code` inside `pre` for fenced blocks; we render the block ourselves above,
          // so suppress the wrapping <pre> to avoid nested margins.
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {children.replace(/ -- /g, ' — ')}
      </ReactMarkdown>
    </Box>
  );
}
