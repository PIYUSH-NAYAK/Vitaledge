// const Sec2 = () => {
//   return (
//     <div>
//       <div className="w-screen h-screen pt-40 bg-black">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Left Image */}
//           <div className="hidden md:block col-span-1">
//             <img
//               src="/m1.avif"
//               alt="Image 1"
//               className="w-72 ml-4 h-auto rounded-3xl"
//             />
//           </div>

//           {/* Center Content */}
//           <div className="col-span-1 md:col-span-2 pt-2">
//             <div className="flex items-center justify-center">
//               <div
//                 className="text-center shadow-md rounded-3xl px-4 py-2 "
//                 style={{ backgroundColor: "#96b3c1" }}
//               >
//                 <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mt-4 underline">
//                   Welcome to VitalEdge
//                 </h1>
//                 <p className="text-black mt-4 mb-4 text-sm md:text-base">
//                   We are an innovative platform powered by blockchain
//                   technology, transforming pharmaceutical tracking. Our system
//                   enables users to monitor the journey of medicines from
//                   production to delivery, ensuring the integrity,
//                   transparency, and safety of pharmaceutical products.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="hidden md:block col-span-1">
//             <img
//               src="/m1.avif"
//               alt="Image 1"
//               className="w-72 ml-3 h-auto rounded-3xl"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sec2;


const Sec2 = () => {
  return (
    <div>
      <div className="w-screen h-auto md:h-screen  pt-10 pb-10 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Image */}
          <div className="col-span-1 flex justify-center md:justify-end">
            <img
              src="/m1.avif"
              alt="Image 1"
              className="w-80 rounded-3xl ml-3 md:w-72 Amrit:w-80 sm:ml-2 my-3 md:h-auto md:rounded-3xl"
            />
          </div>

          {/* Center Content */}
          <div className="col-span-2  md:col-span-2 px-5 py-2 md:mt-5 md:mb-5 Amrit:ml-4  flex justify-center">
            <div className="flex items-center justify-center  w-80 md:w-auto   ">
              <div
                className="text-center shadow-md rounded-3xl p-4 Amrit:h-60  flex flex-col  justify-center items-center"
                style={{ backgroundColor: "#96b3c1" }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800  underline">
                  Welcome to VitalEdge
                </h1>
                <p className="text-black mt-4 mb-4 text-sm md:text-base Amrit:mx-4 Amrit:text-xl">
                  We are an innovative platform powered by blockchain
                  technology, transforming pharmaceutical tracking. Our system
                  enables users to monitor the journey of medicines from
                  production to delivery, ensuring the integrity,
                  transparency, and safety of pharmaceutical products.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-span-1 flex justify-center md:justify-end Amrit:mr-10">
            <img
              src="/m1.avif"
              alt="Image 1"
              className="w-80 rounded-3xl ml-3 my-3 md:w-72 Amrit:w-80 Amrit:mr-0 md:mr-5  md:h-auto md:rounded-3xl"
            />
          </div>
          {/* <div className="col-span-1 flex justify-center md:justify-end">
            <img
              src="/m1.avif"
              alt="Image 1"
              className="w-full max-w-[20rem] sm:max-w-[20rem] md:max-w-[18rem] h-auto rounded-3xl"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sec2;
