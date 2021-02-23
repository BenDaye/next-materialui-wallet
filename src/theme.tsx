import type '@material-ui/lab/themeAugmentation';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider as TP } from '@material-ui/core/styles';
import { Children } from './components';
import { memo, ReactElement, useMemo } from 'react';
import { orange, grey, blue } from '@material-ui/core/colors';

function ThemeProvider({ children }: Children): ReactElement<Children> {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: prefersDarkMode ? grey[900] : blue[500]
          },
          secondary: {
            main: prefersDarkMode ? orange[500] : grey[50]
          },
        },
        overrides: {
          MuiBottomNavigationAction: {
            "root": {
              "&$selected": {
                "color": prefersDarkMode ? orange[500] : blue[500]
              }
            }
          }
        }
      }),
    [prefersDarkMode]
  );

  return <TP theme={theme}>{children}</TP>;
}

export default memo(ThemeProvider);
