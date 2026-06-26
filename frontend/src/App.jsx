import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import Pacientes  from './pages/Pacientes';
import Citas      from './pages/Citas';
import Atenciones from './pages/Atenciones';
import Auditoria  from './pages/Auditoria';
import Usuarios   from './pages/Usuarios';

// Ruta protegida: redirige al login si no hay sesión
function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', flexDirection:'column', gap:16, color:'#0f4c81' }}>
      <i className="bi bi-hospital" style={{ fontSize:40 }}></i>
      <p style={{ fontFamily:'Inter,sans-serif', fontWeight:500 }}>Cargando sistema...</p>
    </div>
  );
  return usuario ? children : <Navigate to="/login" replace />;
}

// Ruta solo para admin
function AdminRoute({ children }) {
  const { usuario } = useAuth();
  return usuario?.rol === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<Login />} />

          {/* Protegidas */}
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/pacientes"  element={<PrivateRoute><Pacientes /></PrivateRoute>} />
          <Route path="/citas"      element={<PrivateRoute><Citas /></PrivateRoute>} />
          <Route path="/atenciones" element={<PrivateRoute><Atenciones /></PrivateRoute>} />

          {/* Solo admin */}
          <Route path="/auditoria" element={<PrivateRoute><AdminRoute><Auditoria /></AdminRoute></PrivateRoute>} />
          <Route path="/usuarios"  element={<PrivateRoute><AdminRoute><Usuarios /></AdminRoute></PrivateRoute>} />

          {/* Redireccionamientos */}
          <Route path="/"   element={<Navigate to="/dashboard" replace />} />
          <Route path="*"   element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
