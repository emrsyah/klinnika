"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

const ClinicApp = () => {
  const {data: session, status} = useSession()
  console.log(session)
  return (
    <div>
    <div>ClinicApp - {session?.user?.id}</div>
    <div>{status}</div>
    </div>
  )
}

export default ClinicApp