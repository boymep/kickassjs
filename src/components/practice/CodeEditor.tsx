import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const extensions = [javascript()];

export default function CodeEditor({ value, onChange }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        mb: 3,
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: '6px',
        overflow: 'hidden',
        '& .cm-editor': {
          fontSize: '14px',
        },
        '& .cm-editor.cm-focused': {
          outline: '2px solid #007AFF',
          outlineOffset: '-1px',
        },
        '& .cm-gutters': {
          backgroundColor: isDark ? '#2C2C2E' : '#F0F0F2',
          border: 'none',
        },
      }}
    >
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        height="400px"
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
  );
}
