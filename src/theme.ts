import { createTheme } from '@mui/material/styles';

export function createAppTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#007AFF' },
      secondary: { main: '#5856D6' },
      success: { main: '#34C759' },
      error: { main: '#FF3B30' },
      warning: { main: '#FF9500' },
      info: { main: '#5AC8FA' },
      background: {
        default: isDark ? '#1C1C1E' : '#F2F2F7',
        paper: isDark ? '#2C2C2E' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F2F2F7' : '#1C1C1E',
        secondary: isDark ? '#AEAEB2' : '#8E8E93',
      },
      divider: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(60,60,67,0.12)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Inter", Arial, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      body1: { fontSize: '0.9375rem', lineHeight: 1.15 },
      body2: { fontSize: '0.875rem', lineHeight: 1.1 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 2px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 16,
            boxShadow: isDark
              ? '0 1px 3px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none' as const,
            fontWeight: 600,
            padding: '8px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            },
          },
          outlined: { borderWidth: 1.5 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark
              ? 'rgba(28,28,30,0.85)'
              : 'rgba(255,255,255,0.72)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            color: isDark ? '#F2F2F7' : '#1C1C1E',
            boxShadow: isDark
              ? '0 0.5px 0 rgba(255,255,255,0.08)'
              : '0 0.5px 0 rgba(0,0,0,0.12)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#252528' : '#F9F9F9',
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: '2px 8px',
            '&.Mui-selected': {
              backgroundColor: 'rgba(0,122,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(0,122,255,0.14)' },
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: { borderRadius: 2, height: 3 },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 6,
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          },
          bar: { borderRadius: 4 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 12 },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          },
        },
      },
    },
  });
}

export default createAppTheme('light');
