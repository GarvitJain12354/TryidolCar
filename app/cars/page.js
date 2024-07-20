import Card from '@/components/Card'
import Nav from '@/components/Nav'
import { carData } from '@/db/CarData'
import React from 'react'

const page = () => {
  return (
    <>
    <Nav/>
    <div className="min-h-screen w-full flex flex-col pt-20 px-10 gap-5">
        <div className="w-full h-10 flex items-center rounded-full border-2 px-2 gap-2">
        <i class="ri-search-line"></i>
        <input type="search" className='w-full outline-none border-none h-full' placeholder='Search car here....' />
        </div>
    <div className="w-full grid grid-cols-5 gap-5  ">
{
    carData?.map((i,index)=>(

    <Card key={index} data={i} index={index}/>
    ))
}

</div>
    </div>
   
    </>
  )
}

export default page