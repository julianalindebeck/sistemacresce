import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/page";
import Prof from "../pages/Prof/page";
import Responsavel from "../pages/Responsavel/page";
import AdminEscolar from "../pages/AdminEscolar/page";
import AdminSistema from "../pages/AdminSistema/page";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-escolar" element={<AdminEscolar />} />
        <Route path="/admin-sistema" element={<AdminSistema />} />
        <Route path="/prof" element={<Prof />} />
        <Route path="/responsavel" element={<Responsavel />} />
      </Routes>
    </BrowserRouter>
  );
}