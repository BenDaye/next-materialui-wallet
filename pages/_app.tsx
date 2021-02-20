import '@fontsource/roboto'
import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '@theme'
import DefaultLayout from '@components/DefaultLayout'
import MainLayout from '@components/MainLayout'

export default function MyApp(props: AppProps) {
  const { Component, pageProps, router } = props

  const mainRouters: String[] = ['/wallet', '/market', '/explorer', '/settings']

  const [isMainRouter, setIsMainRouter] = React.useState(false)

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  React.useEffect(() => {
    console.log(router)
    setIsMainRouter(mainRouters.includes(router.route))
  }, [router])

  return (
    <React.Fragment>
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
        {isMainRouter ? (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ) : (
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        )}
      </ThemeProvider>
    </React.Fragment>
  )
}
