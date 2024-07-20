import Link from 'next/link'
import React from 'react'

const Card = ({data,index}) => {
  return (
    <Link href={`/car/${index}`}>
        <div className="w-full h-[40vh] border-2 rounded-xl overflow-hidden relative flex flex-col">
            <img src={data?.img} alt="" className='h-[80%] w-full object-cover'/>
            <h1 className='font-bold text-lg ml-4'>{data?.name}</h1>
            <h1 className='font-bold text-lg ml-4'>₹ {data?.rent}</h1>
        </div>
    </Link>
  )
}

export default Card