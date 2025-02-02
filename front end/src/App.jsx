import { Navigate, Route, Routes } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
// import Benefits from "./components/Benefits";
// import Collaboration from "./components/Collaboration";
import ContactPage from "./components/ContactUs";
import Footer from "./components/Footer";
import Header from "./components/Header";
// import Hero from "./components/Hero";
// import Pricing from "./components/Pricing";
// import Roadmap from "./components/Roadmap";
// import Services from "./components/Services";
import { Homepage } from "./components/Homepage";
import Login from "./components/Login";
// import Signup from "./components/Signup";
import Products from "./comp2/Products";
import AboutPage from "./components/Aboutus";
import SignupForm from "./components/Signup";


const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<SignupForm />} />
          <Route path='/products' element={<Products />} />
          <Route path='/aboutus' element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>

      <ButtonGradient />
    </>




  );
};

export default App;
