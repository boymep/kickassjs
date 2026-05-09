import { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper,  Typography, useTheme } from '@mui/material';
import Stack from './Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import type { Playground } from '../../types/lesson';
import { Inline } from '../../utils/renderInline';
import { useStdoutRunner } from '../../hooks/useStdoutRunner';
import { normalizeOutput } from '../../utils/stdoutRunner';

const extensions = [javascript()];

interface InlinePlaygroundProps {
  playground: Playground;
}

/**
 * Mini code playground embedded in a lesson chapter.
 * Captures console output via the stdout sandbox runner. If `expectedOutput` is provided,
 * we compare normalised output and surface a pass/fail badge — otherwise it's an open-ended
 * "run and see what happens" tool.
 */
export default function InlinePlayground({ playground }: InlinePlaygroundProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [code, setCode] = useState(playground.starterCode);
  const { result, running, run, reset } = useStdoutRunner();

  useEffect(() => {
    setCode(playground.starterCode);
    reset();
  }, [playground.starterCode, reset]);

  const handleRun = () => run(code);
  const handleReset = () => {
    setCode(playground.starterCode);
    reset();
  };

  const expectedNormalised = playground.expectedOutput
    ? normalizeOutput(playground.expectedOutput)
    : null;
  const actualNormalised = result ? normalizeOutput(result.output) : null;
  const passed =
    expectedNormalised !== null && actualNormalised !== null && !result?.error
      ? actualNormalised === expectedNormalised
      : null;

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ lineHeight: 1, m: 0 }}
        >
          Песочница
        </Typography>
        {playground.expectedOutput && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ lineHeight: 1, m: 0 }}
          >
            · цель — определённый вывод
          </Typography>
        )}
      </Box>
      {playground.description && (
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          <Inline>{playground.description}</Inline>
        </Typography>
      )}
      <Box
        sx={{
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          borderRadius: 1.5,
          overflow: 'hidden',
          mb: 1.5,
          '& .cm-editor': { fontSize: '13.5px' },
          '& .cm-editor.cm-focused': { outline: '2px solid #007AFF', outlineOffset: '-1px' },
          '& .cm-gutters': {
            backgroundColor: isDark ? '#2C2C2E' : '#F0F0F2',
            border: 'none',
          },
        }}
      >
        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={extensions}
          height="auto"
          minHeight="100px"
          maxHeight="320px"
          theme={isDark ? 'dark' : 'light'}
          basicSetup={{
            lineNumbers: true,
            foldGutter: false,
            autocompletion: false,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
            tabSize: 2,
          }}
        />
      </Box>
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleRun}
          disabled={running}
          size="small"
        >
          {running ? 'Выполняется…' : 'Запустить'}
        </Button>
        <Button startIcon={<RestartAltIcon />} onClick={handleReset} size="small">
          Сбросить
        </Button>
      </Stack>
      {result && (
        <Box sx={{ mt: 2 }}>
          {result.error ? (
            <Alert severity="error" icon={<HighlightOffIcon />}>
              <Box sx={{ fontFamily: 'monospace', fontSize: 13 }}>{result.error}</Box>
            </Alert>
          ) : passed === true ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Вывод совпадает с ожидаемым.
            </Alert>
          ) : passed === false ? (
            <Alert severity="warning" icon={<HighlightOffIcon />}>
              Вывод не совпадает с ожидаемым. Сравни строки внимательно.
            </Alert>
          ) : null}
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Вывод
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {result.output || <Box component="span" sx={{ opacity: 0.6 }}>(пусто)</Box>}
          </Box>
          {expectedNormalised && passed === false && (
            <>
              <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                Ожидалось
              </Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 1.5,
                  borderRadius: 1.5,
                  backgroundColor: isDark ? 'rgba(76,175,80,0.08)' : 'rgba(76,175,80,0.08)',
                  fontFamily: '"Fira Code", "SF Mono", Consolas, monospace',
                  fontSize: 13,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {expectedNormalised}
              </Box>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}
