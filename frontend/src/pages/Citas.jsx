import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal  from '../components/Modal';
import api    from '../services/api';

const ESTADOS = ['pendiente','confirmada','atendida','cancelada'];
const EMPTY   = { paciente_id:'', medico_id:'', fecha_hora:'', motivo:'', observaciones:'' };

export default function Citas() {
  const [citas,     setCitas]     = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos,   setMedicos]   = useState([]);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [error,     setError]     = useState('');
  const [ok,        setOk]        = useState('');

  const cargarCitas = () => api.get('/api/citas/').then(r => setCitas(r.data)).catch(() => {});

  useEffect(() => {
    cargarCitas();
    api.get('/api/pacientes/').then(r => setPacientes(r.data)).catch(() => {});
    api.get('/api/auth/usuarios').then(r => setMedicos(r.data.filter(u => u.rol === 'medico'))).catch(() => {});
  }, []);

  const guardar = async () => {
    setError('');
    if (!form.paciente_id || !form.medico_id || !form.fecha_hora || !form.motivo) {
      setError('Completa todos los campos obligatorios.'); return;
    }
    try {
      await api.post('/api/citas/', { ...form, paciente_id:+form.paciente_id, medico_id:+form.medico_id });
      setModal(false); setForm(EMPTY); cargarCitas();
      setOk('Cita registrada correctamente.'); setTimeout(() => setOk(''), 3500);
    } catch (e) { setError(e.response?.data?.detail || 'Error al registrar.'); }
  };

  const cambiarEstado = async (id, estado) => {
    try { await api.put(`/api/citas/${id}/estado?estado=${estado}`); cargarCitas(); } catch (_) {}
  };

  const nombrePaciente = id => {
    const p = pacientes.find(x => x.id === id);
    return p ? `${p.apellidos}, ${p.nombres}` : `#${id}`;
  };
  const nombreMedico = id => {
    const m = medicos.find(x => x.id === id);
    return m ? m.nombre : `#${id}`;
  };

  return (
    <Layout titulo="Citas">
      {ok && <div className="alert-custom alert-success"><i className="bi bi-check-circle-fill"></i>{ok}</div>}

      <div className="card">
        <div className="card-header-custom">
          <h5><i className="bi bi-calendar3"></i>Agenda de Citas</h5>
          <button className="btn-primary-custom" onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
            <i className="bi bi-calendar-plus"></i>Nueva cita
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          {citas.length === 0
            ? <div className="empty-state"><i className="bi bi-calendar3"></i><p>No hay citas registradas.</p></div>
            : <table className="table-custom">
                <thead><tr>
                  <th>#</th><th>Paciente</th><th>Médico</th>
                  <th>Fecha y hora</th><th>Motivo</th><th>Estado</th><th>Cambiar estado</th>
                </tr></thead>
                <tbody>
                  {citas.map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ color:'#94a3b8', fontSize:12 }}>{i+1}</td>
                      <td><strong>{nombrePaciente(c.paciente_id)}</strong></td>
                      <td style={{ fontSize:13 }}>{nombreMedico(c.medico_id)}</td>
                      <td style={{ fontSize:12, whiteSpace:'nowrap' }}>
                        {new Date(c.fecha_hora).toLocaleString('es-PE')}
                      </td>
                      <td>{c.motivo}</td>
                      <td><span className={`badge-custom badge-${c.estado}`}>{c.estado}</span></td>
                      <td>
                        <select className="form-control-custom"
                          style={{ padding:'4px 8px', fontSize:12, width:'auto', minWidth:120 }}
                          value={c.estado} onChange={e => cambiarEstado(c.id, e.target.value)}>
                          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
        <div className="table-footer">{citas.length} cita(s) en total</div>
      </div>

      {modal && (
        <Modal titulo="Registrar nueva cita" onClose={() => setModal(false)}>
          <div className="modal-body">
            {error && <div className="alert-custom alert-error"><i className="bi bi-exclamation-circle-fill"></i>{error}</div>}
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-custom">Paciente *</label>
                <select className="form-control-custom" value={form.paciente_id}
                  onChange={e => setForm({ ...form, paciente_id:e.target.value })}>
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.apellidos}, {p.nombres} — {p.dni}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label-custom">Médico *</label>
                <select className="form-control-custom" value={form.medico_id}
                  onChange={e => setForm({ ...form, medico_id:e.target.value })}>
                  <option value="">Seleccionar médico...</option>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label-custom">Fecha y hora *</label>
                <input type="datetime-local" className="form-control-custom"
                  value={form.fecha_hora} onChange={e => setForm({ ...form, fecha_hora:e.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label-custom">Motivo de consulta *</label>
                <input type="text" className="form-control-custom"
                  value={form.motivo} onChange={e => setForm({ ...form, motivo:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Observaciones (opcional)</label>
                <textarea className="form-control-custom" rows={2}
                  value={form.observaciones} onChange={e => setForm({ ...form, observaciones:e.target.value })} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-outline-custom" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary-custom" onClick={guardar}>
              <i className="bi bi-check2"></i>Registrar cita
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
