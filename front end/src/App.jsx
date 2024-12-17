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

        <div className="w-screen h-screen bg-[url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1955&q=80')] 
        // bg-cover bg-center bg-red-300 flex justify-center">
        <div className="text-6xl text-center pt-20 text-slate-800 font-bold mt-24">
          Welcome to VItaledge
        </div>
        
      </div>

      </div>

      {/* <div><Navbar2/> </div> */}
    </>
  );
}
