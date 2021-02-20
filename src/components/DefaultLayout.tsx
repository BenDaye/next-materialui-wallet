import { Box } from '@material-ui/core'
import React from 'react'
import styles from '@styles/Layout.module.css'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout({
  children,
}: Props): React.ReactElement<Props> | null {
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexWrap="nowrap"
      className={styles.root}
    >
      <Box flexGrow={1}>{children}</Box>
    </Box>
  )
}
