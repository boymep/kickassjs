import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert, useTheme } from '@mui/material';
import type { FillBlankQuestion as FBQ } from '../../types/quiz';
import { Inline } from '../../utils/renderInline';
import { Highlight, themes } from 'prism-react-renderer';

const BLANK_MARKER = '___BLANK___';

interface Props {
  question: FBQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const blankBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#007AFF',
  color: '#fff',
  borderRadius: '4px',
  padding: '2px 12px',
  fontWeight: 700,
  fontSize: '13px',
  letterSpacing: '1px',
  verticalAlign: 'baseline',
};

function selectedBadgeStyle(isDark: boolean): React.CSSProperties {
  return {
    display: 'inline-block',
    backgroundColor: isDark ? 'rgba(10,132,255,0.18)' : 'rgba(0,122,255,0.10)',
    borderBottom: `2px solid ${isDark ? '#0A84FF' : '#007AFF'}`,
    borderRadius: '4px',
    padding: '1px 6px',
    fontWeight: 600,
    verticalAlign: 'baseline',
  };
}

function HighlightedLine({ code, isDark }: { code: string; isDark: boolean }) {
  return (
    <Highlight theme={isDark ? themes.vsDark : themes.github} code={code} language="javascript">
      {({ tokens, getTokenProps }) => (
        <>
          {tokens[0]?.map((token, key) => (
            <span key={key} {...getTokenProps({ token })} />
          ))}
        </>
      )}
    </Highlight>
  );
}

function CodeWithBlank({
  code,
  blankText,
  isDark,
}: {
  code: string;
  blankText: string | null;
  isDark: boolean;
}) {
  const lines = code.trim().split('\n');

  const preStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '12px',
    overflow: 'auto',
    fontSize: '13.5px',
    lineHeight: 1.6,
    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
    backgroundColor: isDark ? '#1E1E1E' : '#F8F8FA',
    color: isDark ? '#D4D4D4' : '#24292e',
    margin: '16px 0',
    fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
  };

  return (
    <pre style={preStyle}>
      {lines.map((line, i) => {
        const hasBlank = line.includes(BLANK_MARKER);

        return (
          <div key={i}>
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
            {hasBlank ? (
              <>
                {(() => {
                  const [before, after] = line.split(BLANK_MARKER);
                  return (
                    <>
                      <HighlightedLine code={before} isDark={isDark} />
                      {blankText === null ? (
                        <span style={blankBadgeStyle}>?</span>
                      ) : (
                        <span style={selectedBadgeStyle(isDark)}>{blankText}</span>
                      )}
                      <HighlightedLine code={after} isDark={isDark} />
                    </>
                  );
                })()}
              </>
            ) : (
              <HighlightedLine code={line} isDark={isDark} />
            )}
          </div>
        );
      })}
    </pre>
  );
}

export default function FillBlankQuestion({ question, onAnswer, answered }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx === question.correctIndex);
  };

  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Заполните пропуск
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Inline>{question.description}</Inline>
      </Typography>
      <CodeWithBlank
        code={question.codeWithBlanks}
        blankText={selected !== null ? question.options[selected] : null}
        isDark={isDark}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {question.options.map((opt, i) => (
          <Button
            key={i}
            variant={selected === i ? 'contained' : 'outlined'}
            color={
              answered
                ? i === question.correctIndex
                  ? 'success'
                  : selected === i
                    ? 'error'
                    : 'inherit'
                : 'primary'
            }
            onClick={() => handleSelect(i)}
            disabled={answered}
            sx={{ fontFamily: 'monospace', textTransform: 'none' }}
          >
            {opt}
          </Button>
        ))}
      </Box>
      {answered && (
        <Alert severity={selected === question.correctIndex ? 'success' : 'error'} sx={{ mt: 2 }}>
          <Inline>{question.explanation}</Inline>
        </Alert>
      )}
    </Paper>
  );
}
