import type {} from '@material-ui/lab/themeAugmentation';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createTheme, ThemeProvider as TP } from '@material-ui/core/styles';
import type { BaseProps } from '@@/types';
import { memo, ReactElement, useMemo } from 'react';
import { orange, grey, blue, yellow, common } from '@material-ui/core/colors';

function ThemeProvider({ children }: BaseProps): ReactElement<BaseProps> {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersDarkMode = false;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          // TODO: 暂时只做深色
          // type: 'dark',
          primary: {
            main: prefersDarkMode ? grey[900] : yellow[500],
          },
          secondary: {
            main: prefersDarkMode ? orange[500] : grey[50],
          },
          background: {},
        },
        overrides: {
          MuiBottomNavigationAction: {
            root: {
              '&$selected': {
                color: prefersDarkMode ? orange[500] : common['black'],
              },
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return <TP theme={theme}>{children}</TP>;
}

export default memo(ThemeProvider);
