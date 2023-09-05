import AuthLoading from '@/components/auth/AuthLoading'
import React from 'react'

const Layout = ({children} : {children: React.ReactNode}) => {
  return (
    <AuthLoading>
        {children}
    </AuthLoading>
  )
}

export default Layout