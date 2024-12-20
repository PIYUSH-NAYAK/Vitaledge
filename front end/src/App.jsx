import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import About from './components/About';
import Home from './mycomp/sec1';
// import About from './mycomp/Aboutus';
import NavBar from '../mycomp2/nav';
import About from './mycomp/Aboutus';
import Nav2 from './mycomp/Nav';

function App() {
  return (
    <Router>
      <Nav2/>
      {/* <NavBar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Aboutus" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
