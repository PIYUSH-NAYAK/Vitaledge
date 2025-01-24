import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import About from './components/About';
import Home from './mycomp/sec1';
// import About from './mycomp/Aboutus';
// import NavBar from '../mycomp2/nav';
import About from './mycomp/Aboutus';
import Nav2 from './mycomp/Nav';
// import ContactPage from './mycomp/Contactus';
import ContactPage from './mycomp/Contactus';
import Services from './mycomp/Services';

function App() {
  return (
    <Router>
      <Nav2 />
      {/* <NavBar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutUs" element={<About />} />
        <Route path="/ContactUs" element={<ContactPage />} />
        <Route path="/Services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
