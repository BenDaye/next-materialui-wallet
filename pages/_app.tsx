import '@fontsource/roboto';
import '@styles/globals.css';
import React, { Fragment, useEffect } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@theme';
import {
  ApiProvider,
  ChainProvider,
  BlockAuthorsProvider,
  EventsProvider,
  AccountsProvider,
  AddressesProvider,
  BalancesProvider,
  QueueProvider,
} from '@components/polkadot/provider';
import { SnackbarProvider } from 'notistack';
import { Slide } from '@material-ui/core';
import { ErrorProvider } from '@components/error';
import Layout from '@components/Layout';
import { SignDialog } from '@components/balance';

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
      <ThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          TransitionComponent={Slide}
        >
          <ErrorProvider>
            <QueueProvider>
              <ApiProvider>
                <ChainProvider>
                  <AccountsProvider>
                    <AddressesProvider>
                      <BalancesProvider>
                        <BlockAuthorsProvider>
                          <EventsProvider>
                            <SignDialog>
                              <Layout>
                                <Component {...pageProps} />
                              </Layout>
                            </SignDialog>
                          </EventsProvider>
                        </BlockAuthorsProvider>
                      </BalancesProvider>
                    </AddressesProvider>
                  </AccountsProvider>
                </ChainProvider>
              </ApiProvider>
            </QueueProvider>
          </ErrorProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Fragment>
  );
}
