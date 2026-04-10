import { Box, TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ value, onChange }: Props) {
  return (
    <Box sx={{ my: 2 }}>
      <TextField
        multiline
        fullWidth
        minRows={12}
        maxRows={30}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          input: {
            sx: {
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              fontSize: '14px',
              lineHeight: 1.6,
              tabSize: 2,
            },
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#F8F8FA',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.08)',
          },
        }}
      />
    </Box>
  );
}
