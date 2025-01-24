// import React from 'react'

import Sec2 from "./sec2";
import Sec3 from "./sec3";
import Sec4 from "./sec4";

const Sec1 = () => {
  return (
    <div>
      {/* <div
          className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80')] 
         bg-cover bg-center  flex justify-center"
        > */}
      <div
        className="w-screen h-screen md:h-screen md:pt-10   flex justify-center items-center pb-52"
      >
        <div className="text-6xl text-center  text-black font-bold mt-24">
          Welcome to Vitaledge
        </div>
      </div>
      <div>
        <Sec2 />
        <Sec3 />
        <Sec4 />
      </div>
    </div>
  );
};

export default Sec1;
