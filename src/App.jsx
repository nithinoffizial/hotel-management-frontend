import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/bookings" element={<Bookings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;