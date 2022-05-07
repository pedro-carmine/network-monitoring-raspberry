import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home";
import "./app.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
      <Router>
          <Topbar />
          <div className="container">
              <Sidebar />
              <Routes>
                  <Route exact path='/' element={<Home />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
