import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api    from '../services/api';

export default function Auditoria() {
  const [logs,   setLogs]   = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    api.get('/api/auditoria/').then(r => setLogs(r.data)).catch(() => {});
  }, []);

  const filtrados = logs.filter(l =>
    `${l.accion} ${l.tabla_afectada} ${l.ip_address}`.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Layout titulo="Auditoría de Seguridad">

      {/* Info OWASP */}
      <div className="alert-custom alert-info" style={{ marginBottom:20 }}>
        <i className="bi bi-shield-fill-check" style={{ flexShrink:0, fontSize:16 }}></i>
        <div>
          <strong>OWASP A09:2021 — Fallos de Registro y Monitoreo de Seguridad</strong>
          <br/>
          <span style={{ fontSize:12 }}>
            Cada acción crítica del sistema (logins, creación, edición y eliminación de registros)
            queda registrada automáticamente con usuario, IP y timestamp.
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-header-custom">
          <h5><i className="bi bi-shield-check"></i>Log de Auditoría</h5>
          <span style={{ fontSize:12, color:'#64748b' }}>
            <i className="bi bi-clock me-1"></i>{logs.length} evento(s) registrado(s)
          </span>
        </div>

        <div style={{ padding:'14px 22px', borderBottom:'1px solid #e2e8f0' }}>
          <div className="search-wrap">
            <i className="bi bi-search si"></i>
            <input className="form-control-custom search-input"
              placeholder="Buscar por acción, tabla o IP..."
              value={filtro} onChange={e => setFiltro(e.target.value)} />
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          {filtrados.length === 0
            ? <div className="empty-state">
                <i className="bi bi-shield-check"></i>
                <p>No hay registros de auditoría aún.</p>
              </div>
            : <table className="table-custom">
                <thead><tr>
                  <th>#</th><th>Usuario ID</th><th>Acción</th>
                  <th>Tabla</th><th>Registro</th><th>IP</th><th>Fecha y hora</th>
                </tr></thead>
                <tbody>
                  {filtrados.map(l => {
                    const esError = l.accion.includes('FALLIDO') || l.accion.includes('ERROR');
                    return (
                      <tr key={l.id}>
                        <td style={{ color:'#94a3b8', fontSize:12 }}>#{l.id}</td>
                        <td style={{ fontSize:13 }}>
                          {l.usuario_id
                            ? <code className="tag">#{l.usuario_id}</code>
                            : <span style={{ color:'#94a3b8' }}>—</span>}
                        </td>
                        <td>
                          <code className={esError ? 'tag-err' : 'tag-ok'}>{l.accion}</code>
                        </td>
                        <td style={{ fontSize:12, color:'#475569' }}>{l.tabla_afectada || '—'}</td>
                        <td style={{ fontSize:12, color:'#475569' }}>
                          {l.registro_id ? `#${l.registro_id}` : '—'}
                        </td>
                        <td style={{ fontSize:12 }}>
                          <code className="tag">{l.ip_address || '—'}</code>
                        </td>
                        <td style={{ fontSize:12, color:'#64748b', whiteSpace:'nowrap' }}>
                          {new Date(l.created_at).toLocaleString('es-PE')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
          }
        </div>
        <div className="table-footer">{filtrados.length} de {logs.length} evento(s)</div>
      </div>
    </Layout>
  );
}
