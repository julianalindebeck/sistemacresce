import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login/page";
import Prof from "../pages/Prof/page";
import Responsavel from "../pages/Responsavel/page";
import AdminEscolar from "../pages/AdminEscolar/page";
import AdminSistema from "../pages/AdminSistema/page";
import { Avisos } from "../pages/Prof/Avisos";
import { Frequencia } from "../pages/Prof/Frequencia";
import { Notas } from "../pages/Prof/Notas";
import { Dashboard } from "../pages/Prof/Dashboard";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/*trocar para pagina inicial do figma*/}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-sistema" element={<ProtectedRoute allowedRoles={["admin_sistema"]}><AdminSistema /></ProtectedRoute>}/>
        <Route path="/admin-escolar" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><AdminEscolar /></ProtectedRoute>}/>
        <Route path="/responsavel" element={<ProtectedRoute allowedRoles={["responsavel"]}><Responsavel /></ProtectedRoute>}/>
        <Route path="/prof" element={<ProtectedRoute allowedRoles={["prof"]}><Prof /></ProtectedRoute>}/>
        <Route path="/prof/dashboard" element={<ProtectedRoute allowedRoles={["prof"]}><Dashboard /></ProtectedRoute>}/>
        <Route path="/prof/avisos" element={<ProtectedRoute allowedRoles={["prof"]}><Avisos /></ProtectedRoute>}/>
        <Route path="/prof/notas" element={<ProtectedRoute allowedRoles={["prof"]}><Notas /></ProtectedRoute>}/>
        <Route path="/prof/frequencia" element={<ProtectedRoute allowedRoles={["prof"]}><Frequencia /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}