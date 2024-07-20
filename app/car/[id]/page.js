"use client"
import Nav from '@/components/Nav'
import { carData } from '@/db/CarData';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { DatePicker, Space } from 'antd';

const page = () => {
const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const {id} = useParams();
const [data, setdata] = useState("");
useEffect(() => {
setdata(carData[id])
}, [])

console.log('====================================');
console.log(data);
console.log('====================================');
  return (
    <>
    <Nav/>
    <div className="w-full h-screen flex items-center justify-center py-20 gap-10">
        <img src={data?.img} className='h-[80%] object-contain ' alt="" />
        <div className="w-1/2 flex flex-col text-bold items-start justify-start gap-3">
        <h1>{data?.name}</h1>
        <h1>Color :- {data?.color}</h1>
        <h1>Rent :- {data?.rent}/per hour</h1>
        <p className='w-1/2'>Details :- {data?.description}</p>
        {/* <Date/> */}
        <h2>Select Date</h2>
        <DatePicker onChange={onChange} />
        <button className='btn bg-blue-500 text-white'>Rent Now</button>
        </div>
    </div>
    </>
  )
}

export default page