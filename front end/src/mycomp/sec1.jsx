// import React from 'react'

import Sec2 from "./sec2"

 


const Sec1 = () => {
  return (
    <div>
        <div
          className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80')] 
         bg-cover bg-center bg-red-300 flex justify-center"
        >
          <div className="text-6xl text-center pt-20 text-slate-800 font-bold mt-24">
            Welcome to VItaledge
          </div>
        </div>
        <div>
            <Sec2 />
        </div>
        
    </div>
  )
}

export default Sec1