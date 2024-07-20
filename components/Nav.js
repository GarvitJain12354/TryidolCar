// import Link from 'next/link'
import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
    <div className="w-full fixed z-20 top-0 h-20 flex items-center justify-between px-20">
        <h1 className='text-2xl font-bold flex items-center justify-center'>
            <img src="/logoCar.png" className='h-10' alt="" />
            EasyRent</h1>
        <div className="flex gap-4 font-semibold">
            <Link href={"/"}>
                 Home
            </Link>
            <Link href={"/cars"}>
                 Cars
            </Link>
            <Link href={"/about"}>
                About
            </Link>
           
        </div>
        <div className="flex ">
            <button className='btn border-2 border-blue-500 text-blue-600 cursor-pointer'>Login/SigUp</button>
        </div>
    </div>
  )
}

export default Nav