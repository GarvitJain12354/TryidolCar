import Nav from '@/components/Nav'
import React from 'react'

const page = () => {
  return (
    <>
    <Nav/>
    <div className="flex h-screen w-full">
      <div className="left flex items-center pl-20 w-1/2 h-full">
        <h1 className='font-bold text-7xl'>
          Easy and Fast Way <br /> to <span className='text-blue-800'> Rent your Car</span>
        </h1>
      </div>
      <div className="right w-1/2 h-full relative">
      <img src="/car.png" alt="" className='absolute bottom-10 right-0' />
      </div>
    </div>
    </>
  )
}

export default page