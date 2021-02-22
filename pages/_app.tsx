import '@fontsource/roboto';
import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '@theme';
import {
  Error,
  Layout,
  ApiProvider,
  ChainProvider,
  BlockAuthorsProvider,
  EventsProvider,
  AccountsProvider,
  AddressesProvider,
} from '@components/index';

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Next Material-UI Wallet</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Error>
          <ApiProvider>
            <ChainProvider>
              <BlockAuthorsProvider>
                <EventsProvider>
                  <AccountsProvider>
                    <AddressesProvider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </AddressesProvider>
                  </AccountsProvider>
                </EventsProvider>
              </BlockAuthorsProvider>
            </ChainProvider>
          </ApiProvider>
        </Error>
      </ThemeProvider>
    </Fragment>
  );
}
