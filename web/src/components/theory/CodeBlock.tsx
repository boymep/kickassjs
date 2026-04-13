import { Highlight, themes } from 'prism-react-renderer';
import { Box, IconButton, Snackbar, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <Box sx={{ position: 'relative', my: 2 }}>
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500', zIndex: 1 }}
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <Highlight
        theme={isDark ? themes.vsDark : themes.github}
        code={code.trim()}
        language={language}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              padding: '16px',
              borderRadius: '12px',
              overflow: 'auto',
              fontSize: '13.5px',
              lineHeight: 1.6,
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              margin: 0,
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '2em',
                    textAlign: 'right',
                    marginRight: '1em',
                    opacity: 0.4,
                    userSelect: 'none',
                  }}
                >
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <Snackbar open={copied} autoHideDuration={1500} onClose={() => setCopied(false)} message="Скопировано" />
    </Box>
  );
}
