import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const OWASP = [
  { code:'A01', label:'Control de acceso por roles (admin / médico / recepcionista)' },
  { code:'A02', label:'Contraseñas cifradas con bcrypt + tokens JWT (30 min)' },
  { code:'A03', label:'Validación Pydantic + ORM sin SQL manual' },
  { code:'A05', label:'Security headers + CORS restringido + variables de entorno' },
  { code:'A07', label:'Bloqueo tras 5 intentos fallidos + contraseña fuerte' },
  { code:'A09', label:'Log automático de todas las acciones críticas' },
];

function StatCard({ icon, num, label, color }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}><i className={`bi bi-${icon}`}></i></div>
      <div>
        <div className="stat-num">{num}</div>
        <div className="stat-lbl">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate    = useNavigate();
  const [stats, setStats] = useState({ pacientes:0, citas:0, atenciones:0 });

  useEffect(() => {
    Promise.all([
      api.get('/api/pacientes/').catch(() => ({ data:[] })),
      api.get('/api/citas/').catch(()     => ({ data:[] })),
      api.get('/api/atenciones/').catch(() => ({ data:[] })),
    ]).then(([p, c, a]) =>
      setStats({ pacientes: p.data.length, citas: c.data.length, atenciones: a.data.length })
    );
  }, []);

  const accesos = [
    { icon:'person-plus',     label:'Nuevo paciente',   to:'/pacientes',  color:'#0f4c81' },
    { icon:'calendar-plus',   label:'Nueva cita',       to:'/citas',      color:'#00a896' },
    { icon:'clipboard2-plus', label:'Nueva atención',   to:'/atenciones', color:'#f4a261' },
    { icon:'shield-check',    label:'Ver auditoría',    to:'/auditoria',  color:'#d62828' },
  ];

  return (
    <Layout titulo="Panel Principal">

      {/* Saludo */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>
          Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋
        </h2>
        <p style={{ color:'#64748b', fontSize:13 }}>
          Sistema de gestión clínica · Controles OWASP Top 10 2021 · Huancayo, Junín 2026
        </p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon="people-fill"           num={stats.pacientes}  label="Pacientes registrados"    color="blue"  />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="calendar-check-fill"   num={stats.citas}      label="Citas programadas"        color="teal"  />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="clipboard2-pulse-fill" num={stats.atenciones} label="Atenciones realizadas"    color="amber" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon="shield-fill-check"     num="6 / 10"           label="Controles OWASP activos"  color="green" />
        </div>
      </div>

      <div className="row g-3">

        {/* Panel OWASP */}
        <div className="col-lg-5">
          <div className="owasp-panel">
            <h4><i className="bi bi-shield-lock me-2"></i>Controles OWASP Top 10 2021</h4>
            {OWASP.map(o => (
              <div className="owasp-item" key={o.code}>
                <i className="bi bi-check-circle-fill check"></i>
                <span className="code">{o.code}</span>
                <span style={{ opacity:.85 }}>{o.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="col-lg-7">
          <div className="card" style={{ height:'100%' }}>
            <div className="card-header-custom">
              <h5><i className="bi bi-lightning-charge"></i>Accesos rápidos</h5>
            </div>
            <div style={{ padding:'18px 22px' }}>
              <div className="row g-3 mb-3">
                {accesos.map(a => (
                  <div className="col-6" key={a.label}>
                    <div onClick={() => navigate(a.to)}
                      style={{ border:`1.5px solid #e2e8f0`, borderRadius:10, padding:16,
                        textAlign:'center', cursor:'pointer', transition:'all .15s', background:'#fff' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = '#f8fafc'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#fff'; }}>
                      <i className={`bi bi-${a.icon}`}
                        style={{ fontSize:26, color:a.color, display:'block', marginBottom:8 }}></i>
                      <span style={{ fontSize:12.5, fontWeight:600, color:'#475569' }}>{a.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nota tesis */}
              <div style={{ padding:'14px 16px', background:'#f0fdf4',
                borderRadius:10, border:'1px solid #bbf7d0' }}>
                <p style={{ fontSize:12, fontWeight:700, color:'#065f46', marginBottom:4 }}>
                  <i className="bi bi-mortarboard me-1"></i>Sobre este sistema
                </p>
                <p style={{ fontSize:12, color:'#047857', lineHeight:1.6 }}>
                  Tesis: <em>"Sistema web con controles de seguridad basados en OWASP Top 10 2021 y su
                  influencia en la seguridad de la información en clínicas privadas de la región Junín, 2026"</em>
                  <br/>Universidad Continental · Ing. de Sistemas e Informática
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
