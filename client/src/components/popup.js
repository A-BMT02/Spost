import React from 'react'

export default function Popup() {
  return (
    <div className='flex flex-col space-y-4 bg-owhite'>
        <p>Are you sure you want to delete Twitter Account</p>
        <div>
             <button className='p-2 border border-ogray'>Cancel</button>
             <button className='p-2 bg-ored border'>Delete</button>
        </div>
       

    </div>
  )
}
