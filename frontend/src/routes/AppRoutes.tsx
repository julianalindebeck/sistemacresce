import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/page";
import Prof from "../pages/Prof/page";
import Responsavel from "../pages/Responsavel/page";
import AdminEscolar from "../pages/AdminEscolar/page";
import AdminSistema from "../pages/AdminSistema/page";
import { Avisos } from "../pages/Prof/Avisos";
import { Frequencia } from "../pages/Prof/Frequencia";
import { Notas } from "../pages/Prof/Notas";
import { Dashboard } from "../pages/Prof/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-escolar" element={<AdminEscolar />} />
        <Route path="/admin-sistema" element={<AdminSistema />} />
        <Route path="/prof" element={<Prof />} />
        <Route path="/responsavel" element={<Responsavel />} />
        <Route path="/prof/dashboard" element={<Dashboard />} />
        <Route path="/prof/notas" element={<Notas />} />
        <Route path="/prof/frequencia" element={<Frequencia />} />
        <Route path="/prof/avisos" element={<Avisos />} />
      </Routes>
    </BrowserRouter>
  );
}