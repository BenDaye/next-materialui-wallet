import { useRouter } from 'next/router'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from '@material-ui/core'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import React from 'react'
import styles from '@styles/Layout.module.css'

interface Props {
  children: React.ReactNode
  bottomNavigation?: React.ReactNode
}

export default function MainLayout({
  children,
  bottomNavigation,
}: Props): React.ReactElement<Props> | null {
  const router = useRouter()
  const [nav, setNav] = React.useState('/wallet')
  const handleChangeNav = (e, v) => {
    router.push(v)
  }

  React.useEffect(() => {
    setNav(router.route)
  }, [router])

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexWrap="nowrap"
      className={styles.root}
    >
      <Box flexGrow={1}>
        {children}
      </Box>
      <Box flexShrink={0}>
        {bottomNavigation ? (
          bottomNavigation
        ) : (
          <BottomNavigation value={nav} onChange={handleChangeNav}>
            <BottomNavigationAction label="钱包" value="/wallet" icon={<RestoreIcon />} />
            <BottomNavigationAction label="市场" value="/market" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="浏览" value="/explorer" icon={<LocationOnIcon />} />
            <BottomNavigationAction label="设置" value="/settings" icon={<LocationOnIcon />} />
          </BottomNavigation>
        )}
      </Box>
    </Box>
  )
}
