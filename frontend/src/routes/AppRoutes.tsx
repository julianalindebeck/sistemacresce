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
import { NotasAlunos } from "../pages/Responsavel/NotasAlunos";
import { FrequenciaAlunos } from "../pages/Responsavel/FrequenciaAlunos";
import { AvisosAlunos } from "../pages/Responsavel/AvisosAlunos";
import { RelatorioFinalAlunos } from "../pages/Responsavel/RelatorioFinalAlunos";
import { Solicitacoes } from "../pages/AdminSistema/Solicitacoes";
import { Escolas } from "../pages/AdminSistema/Escolas";
import { DashboardAdminEscolar } from "../pages/AdminEscolar/DashboardAdminEscolar";
import { Professores } from "../pages/AdminEscolar/Professores";
import { Alunos } from "../pages/AdminEscolar/Alunos";
import { Turmas } from "../pages/AdminEscolar/Turmas";
import { Disciplinas } from "../pages/AdminEscolar/Disciplinas";
import { AvisosAdminEscolar } from "../pages/AdminEscolar/AvisosAdminEscolar";
import { RelatorioFinalAdminEscolar } from "../pages/AdminEscolar/RelatorioFinalAdminEscolar";
import { Escola } from "../pages/AdminEscolar/Escola";
import TelaInicial from "../pages/Home/TelaInicial";
import TelaCadastro from "../pages/Home/TelaCadastro";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaInicial/>} />
        <Route path="/telacadastro" element={<TelaCadastro/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-sistema" element={<ProtectedRoute allowedRoles={["admin_sistema"]}><AdminSistema /></ProtectedRoute>}/>
        <Route path="/admin-escolar" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><AdminEscolar /></ProtectedRoute>}/>
        <Route path="/responsavel" element={<ProtectedRoute allowedRoles={["responsavel"]}><Responsavel /></ProtectedRoute>}/>
        <Route path="/prof" element={<ProtectedRoute allowedRoles={["prof"]}><Prof /></ProtectedRoute>}/>
        <Route path="/prof/dashboard" element={<ProtectedRoute allowedRoles={["prof"]}><Dashboard /></ProtectedRoute>}/>
        <Route path="/prof/avisos" element={<ProtectedRoute allowedRoles={["prof"]}><Avisos /></ProtectedRoute>}/>
        <Route path="/prof/notas" element={<ProtectedRoute allowedRoles={["prof"]}><Notas /></ProtectedRoute>}/>
        <Route path="/prof/frequencia" element={<ProtectedRoute allowedRoles={["prof"]}><Frequencia /></ProtectedRoute>}/>
        <Route path="/responsavel/notas" element={<ProtectedRoute allowedRoles={["responsavel"]}><NotasAlunos /></ProtectedRoute>}/>
        <Route path="/responsavel/frequencia" element={<ProtectedRoute allowedRoles={["responsavel"]}><FrequenciaAlunos /></ProtectedRoute>}/>
        <Route path="/responsavel/avisos" element={<ProtectedRoute allowedRoles={["responsavel"]}><AvisosAlunos /></ProtectedRoute>}/>
        <Route path="/responsavel/relatoriofinal" element={<ProtectedRoute allowedRoles={["responsavel"]}><RelatorioFinalAlunos /></ProtectedRoute>}/>
        <Route path="/admin-sistema/solicitacoes" element={<ProtectedRoute allowedRoles={["admin_sistema"]}><Solicitacoes/></ProtectedRoute>}/>
        <Route path="/admin-sistema/escolas" element={<ProtectedRoute allowedRoles={["admin_sistema"]}><Escolas/></ProtectedRoute>}/>
        <Route path="/admin-escolar/dashboard" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><DashboardAdminEscolar/></ProtectedRoute>}/>
        <Route path="/admin-escolar/professores" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><Professores/></ProtectedRoute>}/>
        <Route path="/admin-escolar/alunos" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><Alunos/></ProtectedRoute>}/>
        <Route path="/admin-escolar/turmas" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><Turmas/></ProtectedRoute>}/>
        <Route path="/admin-escolar/disciplinas" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><Disciplinas/></ProtectedRoute>}/>
        <Route path="/admin-escolar/avisos" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><AvisosAdminEscolar/></ProtectedRoute>}/>
        <Route path="/admin-escolar/relatoriofinal" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><RelatorioFinalAdminEscolar/></ProtectedRoute>}/>
        <Route path="/admin-escolar/escola" element={<ProtectedRoute allowedRoles={["admin_escolar"]}><Escola/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}