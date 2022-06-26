import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/Home/Home";
import "./app.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Data from "./pages/Data/Data";

function App() {
  return (
      <Router>
          <Topbar />
          <div className="container">
              <Sidebar />
              <Routes>
                  <Route exact path='/' element={<Home />} />
                  <Route exact path='/devices' element={<Data />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
