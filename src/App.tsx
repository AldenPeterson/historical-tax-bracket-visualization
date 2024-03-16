import { Routes, Route, HashRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import FAQ from "./pages/Faq";
import Calculator from "./pages/Calculator";

const App = () => {
  return (
    <HashRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Calculator />}></Route>
        <Route path="/faq" element={<FAQ />}></Route>
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </HashRouter>
  );
};

export default App;
