import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal  from '../components/Modal';
import api    from '../services/api';

const EMPTY = { nombres:'', apellidos:'', dni:'', fecha_nacimiento:'', telefono:'', direccion:'', email:'' };

export default function Pacientes() {
  const [lista,    setLista]    = useState([]);
  const [filtro,   setFiltro]   = useState('');
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);
  const [error,    setError]    = useState('');
  const [ok,       setOk]       = useState('');
  const [loading,  setLoading]  = useState(false);

  const cargar = () => api.get('/api/pacientes/').then(r => setLista(r.data)).catch(() => {});
  useEffect(() => { cargar(); }, []);

  const filtrados = lista.filter(p =>
    `${p.nombres} ${p.apellidos} ${p.dni} ${p.telefono||''}`.toLowerCase().includes(filtro.toLowerCase())
  );

  const abrirNuevo  = () => { setForm(EMPTY); setEditId(null); setError(''); setModal(true); };
  const abrirEditar = p  => {
    setForm({ nombres:p.nombres, apellidos:p.apellidos, dni:p.dni,
      fecha_nacimiento:p.fecha_nacimiento||'', telefono:p.telefono||'',
      direccion:p.direccion||'', email:p.email||'' });
    setEditId(p.id); setError(''); setModal(true);
  };

  const guardar = async () => {
    setError(''); setLoading(true);
    try {
      const payload = { ...form, fecha_nacimiento: form.fecha_nacimiento || null };
      if (editId) await api.put(`/api/pacientes/${editId}`, payload);
      else        await api.post('/api/pacientes/', payload);
      setModal(false); cargar();
      setOk(editId ? 'Paciente actualizado correctamente.' : 'Paciente registrado correctamente.');
      setTimeout(() => setOk(''), 3500);
    } catch (e) {
      setError(e.response?.data?.detail || 'Error al guardar. Verifica los datos.');
    } finally { setLoading(false); }
  };

  const eliminar = async id => {
    if (!window.confirm('¿Eliminar este paciente? Esta acción no se puede deshacer.')) return;
    try { await api.delete(`/api/pacientes/${id}`); cargar(); } catch (_) {}
  };

  const f = (k, l, t = 'text', col = 6) => (
    <div className={`col-${col}`} key={k}>
      <label className="form-label-custom">{l}</label>
      <input type={t} className="form-control-custom" value={form[k]}
        onChange={e => setForm({ ...form, [k]: e.target.value })} />
    </div>
  );

  return (
    <Layout titulo="Pacientes">

      {ok && <div className="alert-custom alert-success"><i className="bi bi-check-circle-fill"></i>{ok}</div>}

      <div className="card">
        {/* Header */}
        <div className="card-header-custom">
          <h5><i className="bi bi-people-fill"></i>Registro de Pacientes</h5>
          <button className="btn-primary-custom" onClick={abrirNuevo}>
            <i className="bi bi-person-plus"></i>Nuevo paciente
          </button>
        </div>

        {/* Search */}
        <div style={{ padding:'14px 22px', borderBottom:'1px solid #e2e8f0' }}>
          <div className="search-wrap">
            <i className="bi bi-search si"></i>
            <input className="form-control-custom search-input"
              placeholder="Buscar por nombre, apellido o DNI..."
              value={filtro} onChange={e => setFiltro(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          {filtrados.length === 0
            ? <div className="empty-state">
                <i className="bi bi-people"></i>
                <p>{filtro ? 'No se encontraron resultados.' : 'No hay pacientes registrados aún.'}</p>
              </div>
            : <table className="table-custom">
                <thead><tr>
                  <th>#</th><th>Apellidos y Nombres</th><th>DNI</th>
                  <th>Teléfono</th><th>Correo</th><th>Acciones</th>
                </tr></thead>
                <tbody>
                  {filtrados.map((p, i) => (
                    <tr key={p.id}>
                      <td style={{ color:'#94a3b8', fontSize:12 }}>{i + 1}</td>
                      <td><strong>{p.apellidos}</strong>, {p.nombres}</td>
                      <td><code className="tag">{p.dni}</code></td>
                      <td>{p.telefono || <span style={{ color:'#94a3b8' }}>—</span>}</td>
                      <td style={{ fontSize:12 }}>{p.email || <span style={{ color:'#94a3b8' }}>—</span>}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn-edit-sm" onClick={() => abrirEditar(p)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn-danger-sm" onClick={() => eliminar(p.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
        <div className="table-footer">{filtrados.length} paciente(s) encontrado(s)</div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal titulo={editId ? 'Editar paciente' : 'Registrar nuevo paciente'} onClose={() => setModal(false)}>
          <div className="modal-body">
            {error && <div className="alert-custom alert-error"><i className="bi bi-exclamation-circle-fill"></i>{error}</div>}
            <div className="row g-3">
              {f('nombres',          'Nombres *',            'text', 6)}
              {f('apellidos',        'Apellidos *',          'text', 6)}
              {f('dni',              'DNI (8 dígitos) *',    'text', 6)}
              {f('fecha_nacimiento', 'Fecha de nacimiento',  'date', 6)}
              {f('telefono',         'Teléfono',             'text', 6)}
              {f('email',            'Correo electrónico',   'email',6)}
              {f('direccion',        'Dirección',            'text', 12)}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-outline-custom" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary-custom" onClick={guardar} disabled={loading}>
              {loading
                ? <><i className="bi bi-hourglass-split"></i> Guardando...</>
                : <><i className="bi bi-check2"></i>{editId ? 'Actualizar' : 'Registrar'}</>
              }
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
