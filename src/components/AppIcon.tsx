import React from 'react'
import logo from "~/klinnika_logo.svg"
import NextImage from '@/components/NextImage'

const AppIcon = () => {
  return (
    <div className='flex items-center gap-2'>
        <NextImage src={logo} width={32} height={32} alt="logo" />
        <h1 className='font-bold mrt text-lg text-blue-900'>Klinnika</h1>
    </div>
  )
}

export default AppIcon