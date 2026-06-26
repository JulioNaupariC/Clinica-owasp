import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal  from '../components/Modal';
import api    from '../services/api';

const EMPTY = { nombre:'', email:'', password:'', rol:'recepcionista' };

export default function Usuarios() {
  const [lista,  setLista]  = useState([]);
  const [modal,  setModal]  = useState(false);
  const [form,   setForm]   = useState(EMPTY);
  const [error,  setError]  = useState('');
  const [ok,     setOk]     = useState('');

  const cargar = () => api.get('/api/auth/usuarios').then(r => setLista(r.data)).catch(() => {});
  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    setError('');
    try {
      await api.post('/api/auth/usuarios', form);
      setModal(false); setForm(EMPTY); cargar();
      setOk('Usuario creado correctamente.'); setTimeout(() => setOk(''), 3500);
    } catch (e) { setError(e.response?.data?.detail || 'Error al crear usuario.'); }
  };

  const ROLES = { admin:'badge-admin', medico:'badge-medico', recepcionista:'badge-recepcionista' };

  return (
    <Layout titulo="Gestión de Usuarios">
      {ok && <div className="alert-custom alert-success"><i className="bi bi-check-circle-fill"></i>{ok}</div>}

      <div className="alert-custom alert-warning">
        <i className="bi bi-person-fill-lock" style={{ flexShrink:0 }}></i>
        <div>
          <strong>OWASP A01 + A07:</strong> Solo administradores pueden gestionar usuarios.
          Las contraseñas se almacenan cifradas con <strong>bcrypt</strong> y nunca en texto plano.
        </div>
      </div>

      <div className="card">
        <div className="card-header-custom">
          <h5><i className="bi bi-person-gear"></i>Usuarios del Sistema</h5>
          <button className="btn-primary-custom" onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
            <i className="bi bi-person-plus"></i>Nuevo usuario
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="table-custom">
            <thead><tr>
              <th>#</th><th>Nombre</th><th>Correo electrónico</th><th>Rol</th><th>Estado</th>
            </tr></thead>
            <tbody>
              {lista.map((u, i) => (
                <tr key={u.id}>
                  <td style={{ color:'#94a3b8', fontSize:12 }}>{i+1}</td>
                  <td><strong>{u.nombre}</strong></td>
                  <td style={{ fontSize:13 }}>{u.email}</td>
                  <td><span className={`badge-custom ${ROLES[u.rol]||''}`}>{u.rol}</span></td>
                  <td>
                    <span className={`badge-custom ${u.activo ? 'badge-activo' : 'badge-inactivo'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">{lista.length} usuario(s) registrado(s)</div>
      </div>

      {modal && (
        <Modal titulo="Crear nuevo usuario" onClose={() => setModal(false)}>
          <div className="modal-body">
            {error && <div className="alert-custom alert-error"><i className="bi bi-exclamation-circle-fill"></i>{error}</div>}
            <div className="alert-custom alert-info" style={{ marginBottom:16 }}>
              <i className="bi bi-shield-lock" style={{ flexShrink:0 }}></i>
              <span style={{ fontSize:12 }}>
                <strong>OWASP A07:</strong> Mínimo 8 caracteres, una mayúscula y un número.
              </span>
            </div>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-custom">Nombre completo *</label>
                <input type="text" className="form-control-custom"
                  value={form.nombre} onChange={e => setForm({ ...form, nombre:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Correo electrónico *</label>
                <input type="email" className="form-control-custom"
                  value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Contraseña *</label>
                <input type="password" className="form-control-custom"
                  placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número"
                  value={form.password} onChange={e => setForm({ ...form, password:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Rol *</label>
                <select className="form-control-custom" value={form.rol}
                  onChange={e => setForm({ ...form, rol:e.target.value })}>
                  <option value="admin">Administrador</option>
                  <option value="medico">Médico</option>
                  <option value="recepcionista">Recepcionista</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-outline-custom" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary-custom" onClick={guardar}>
              <i className="bi bi-check2"></i>Crear usuario
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
