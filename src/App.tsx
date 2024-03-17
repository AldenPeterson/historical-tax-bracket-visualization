import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FAQ from "./pages/Faq";
import Calculator from "./pages/Calculator";

const App = () => {


  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Calculator />}></Route>
        <Route path="/faq" element={<FAQ />}></Route>
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </div>
  );
};

export default App;
