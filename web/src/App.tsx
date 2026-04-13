import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { createAppTheme } from './theme';
import { router } from './router';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('colorMode') as 'light' | 'dark') ?? 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', next);
          return next;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
