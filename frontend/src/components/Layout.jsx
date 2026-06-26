import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavItem({ to, icon, label }) {
  const location = useLocation();
  const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
  return (
    <NavLink to={to} className={`nav-item ${active ? 'active' : ''}`}>
      <i className={`bi bi-${icon}`}></i> {label}
    </NavLink>
  );
}

export default function Layout({ children, titulo }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const iniciales = usuario?.nombre
    ?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  const cerrarSesion = () => { logout(); navigate('/login'); };

  return (
    <div className="layout">
      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2><i className="bi bi-hospital me-2"></i>Clínica OWASP</h2>
          <p>Sistema de Gestión Médica</p>
          <span className="badge-owasp">OWASP TOP 10 2021</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Principal</div>
          <NavItem to="/dashboard"  icon="speedometer2"       label="Panel Principal" />

          <div className="nav-section">Gestión</div>
          <NavItem to="/pacientes"  icon="people"             label="Pacientes" />
          <NavItem to="/citas"      icon="calendar3"          label="Citas" />
          <NavItem to="/atenciones" icon="clipboard2-pulse"   label="Atenciones" />

          {usuario?.rol === 'admin' && (
            <>
              <div className="nav-section">Administración</div>
              <NavItem to="/usuarios"  icon="person-gear"   label="Usuarios" />
              <NavItem to="/auditoria" icon="shield-check"  label="Auditoría" />
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={cerrarSesion} style={{ color: '#fca5a5' }}>
            <i className="bi bi-box-arrow-left"></i> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MAIN ───────────────────────────────── */}
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{titulo}</span>
          <div className="user-badge">
            <div className="avatar">{iniciales}</div>
            <div>
              <div className="user-name">{usuario?.nombre}</div>
              <div className="user-rol">{usuario?.rol}</div>
            </div>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
