// import Navbar2 from "../mycomp/nav";

import NavBar from "../mycomp/nav";
// import HomePage from "../mycomp/section1";
// import Nav2 from "../mycomp/nav";
// import Navbar from "../mycomp/nav";

export default function App() {
  return (
    <>
      <div className="w-screen h-screen bg-red-200 ">
        <div>
          <NavBar />
        </div>

        <div
          className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80')] 
        // bg-cover bg-center bg-red-300 flex justify-center"
        >
          <div className="text-6xl text-center pt-20 text-slate-800 font-bold mt-24">
            Welcome to VItaledge
          </div>
        </div>
        <div className="w-screen h-screen pt-40">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 p-4">
              <img src="/m1.avif" alt="Image 1" className="w-full h-auto rounded-3xl" />
            </div>

            <div className="col-span-1 mx-4 my-6 ">
              <div className="bg-slate-100  flex items-center justify-center ">
                <div
                  className="text-center py-4 px-4 shadow-md rounded-3xl"
                  style={{ backgroundColor: "#96b3c1" }}
                >
                 
                  <h1 className="text-3xl font-bold text-blue-800 mt-2 underline">
                    Welcome to VitalEdge
                  </h1>
                  <p className="text-black mt-4">
                    We are an innovative platform powered by blockchain
                    technology, transforming pharmaceutical tracking. Our system
                    enables users to monitor the journey of medicines from
                    production to delivery, ensuring the integrity,
                    transparency, and safety of pharmaceutical products.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-1 p-4">
              <img src="/m1.avif" alt="Image 2" className="w-full h-auto rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* <div><Navbar2/> </div> */}
    </>
  );
}
