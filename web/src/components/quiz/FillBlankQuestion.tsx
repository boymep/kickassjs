import { useState } from 'react';
import { Paper, Typography, Button, Box, Alert } from '@mui/material';
import type { FillBlankQuestion as FBQ } from '../../types/quiz';
import { Highlight, themes } from 'prism-react-renderer';

const BLANK_MARKER = '___BLANK___';

interface Props {
  question: FBQ;
  onAnswer: (correct: boolean) => void;
  answered: boolean;
}

const preStyle: React.CSSProperties = {
  padding: '16px',
  borderRadius: '6px',
  overflow: 'auto',
  fontSize: '13.5px',
  lineHeight: 1.6,
  border: '1px solid rgba(0,0,0,0.06)',
  backgroundColor: '#F8F8FA',
  margin: '16px 0',
  fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
};

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

const selectedBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: 'rgba(0,122,255,0.1)',
  borderBottom: '2px solid #007AFF',
  borderRadius: '4px',
  padding: '1px 6px',
  fontWeight: 600,
  verticalAlign: 'baseline',
};

function HighlightedLine({ code }: { code: string }) {
  return (
    <Highlight theme={themes.github} code={code} language="javascript">
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

function CodeWithBlank({ code, blankText }: { code: string; blankText: string | null }) {
  const lines = code.trim().split('\n');

  return (
    <pre style={preStyle}>
      {lines.map((line, i) => {
        const hasBlank = line.includes(BLANK_MARKER);

        return (
          <div key={i} style={{ color: '#24292e' }}>
            <span style={{ display: 'inline-block', width: '2em', textAlign: 'right', marginRight: '1em', opacity: 0.4, userSelect: 'none' }}>
              {i + 1}
            </span>
            {hasBlank ? (
              <>
                {(() => {
                  const [before, after] = line.split(BLANK_MARKER);
                  return (
                    <>
                      <HighlightedLine code={before} />
                      {blankText === null ? (
                        <span style={blankBadgeStyle}>?</span>
                      ) : (
                        <span style={selectedBadgeStyle}>{blankText}</span>
                      )}
                      <HighlightedLine code={after} />
                    </>
                  );
                })()}
              </>
            ) : (
              <HighlightedLine code={line} />
            )}
          </div>
        );
      })}
    </pre>
  );
}

export default function FillBlankQuestion({ question, onAnswer, answered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    onAnswer(idx === question.correctIndex);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Заполни пропуск
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.description}
      </Typography>
      <CodeWithBlank
        code={question.codeWithBlanks}
        blankText={selected !== null ? question.options[selected] : null}
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
          {question.explanation}
        </Alert>
      )}
    </Paper>
  );
}
