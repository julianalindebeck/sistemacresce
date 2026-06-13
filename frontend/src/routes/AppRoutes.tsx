import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/page";
import Admin from "../pages/Admin/page";
import Prof from "../pages/Prof/page";
import Responsavel from "../pages/Responsavel/page";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/prof" element={<Prof />} />
        <Route path="/responsavel" element={<Responsavel />} />
      </Routes>
    </BrowserRouter>
  );
}