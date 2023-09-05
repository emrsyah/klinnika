import React from 'react'
import logo from "~/klinnika_logo.svg"
import NextImage from '@/components/NextImage'

const ClinicIcon = ({name} : {name: string}) => {
  return (
    <div className='flex items-center gap-2'>
        <NextImage src={logo} width={24} height={24} alt="logo" />
        <h1 className='font-bold mrt text-base text-blue-900'>{name}</h1>
    </div>
  )
}

export default ClinicIcon