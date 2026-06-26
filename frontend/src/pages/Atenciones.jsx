import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal  from '../components/Modal';
import api    from '../services/api';

const EMPTY = { paciente_id:'', medico_id:'', cita_id:'', diagnostico:'', tratamiento:'', observaciones:'' };

export default function Atenciones() {
  const [lista,     setLista]     = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos,   setMedicos]   = useState([]);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [error,     setError]     = useState('');
  const [ok,        setOk]        = useState('');

  const cargar = () => api.get('/api/atenciones/').then(r => setLista(r.data)).catch(() => {});

  useEffect(() => {
    cargar();
    api.get('/api/pacientes/').then(r => setPacientes(r.data)).catch(() => {});
    api.get('/api/auth/usuarios').then(r => setMedicos(r.data.filter(u => u.rol === 'medico'))).catch(() => {});
  }, []);

  const guardar = async () => {
    setError('');
    if (!form.paciente_id || !form.medico_id || !form.diagnostico || !form.tratamiento) {
      setError('Completa los campos obligatorios.'); return;
    }
    try {
      await api.post('/api/atenciones/', {
        ...form,
        paciente_id: +form.paciente_id,
        medico_id:   +form.medico_id,
        cita_id:     form.cita_id ? +form.cita_id : null,
      });
      setModal(false); setForm(EMPTY); cargar();
      setOk('Atención registrada correctamente.'); setTimeout(() => setOk(''), 3500);
    } catch (e) { setError(e.response?.data?.detail || 'Error al registrar.'); }
  };

  const nombrePaciente = id => { const p = pacientes.find(x => x.id === id); return p ? `${p.apellidos}, ${p.nombres}` : `#${id}`; };
  const nombreMedico   = id => { const m = medicos.find(x => x.id === id);   return m ? m.nombre : `#${id}`; };

  return (
    <Layout titulo="Atenciones Médicas">
      {ok && <div className="alert-custom alert-success"><i className="bi bi-check-circle-fill"></i>{ok}</div>}

      <div className="alert-custom alert-info">
        <i className="bi bi-info-circle-fill" style={{ flexShrink:0 }}></i>
        <span>Solo médicos y administradores pueden registrar y ver atenciones médicas — <strong>OWASP A01</strong>.</span>
      </div>

      <div className="card">
        <div className="card-header-custom">
          <h5><i className="bi bi-clipboard2-pulse"></i>Historial de Atenciones</h5>
          <button className="btn-primary-custom" onClick={() => { setForm(EMPTY); setError(''); setModal(true); }}>
            <i className="bi bi-clipboard2-plus"></i>Nueva atención
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          {lista.length === 0
            ? <div className="empty-state"><i className="bi bi-clipboard2-pulse"></i><p>No hay atenciones registradas.</p></div>
            : <table className="table-custom">
                <thead><tr>
                  <th>#</th><th>Paciente</th><th>Médico</th>
                  <th>Diagnóstico</th><th>Tratamiento</th><th>Fecha</th>
                </tr></thead>
                <tbody>
                  {lista.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color:'#94a3b8', fontSize:12 }}>{i+1}</td>
                      <td><strong>{nombrePaciente(a.paciente_id)}</strong></td>
                      <td style={{ fontSize:13 }}>{nombreMedico(a.medico_id)}</td>
                      <td style={{ maxWidth:200, fontSize:13 }}>{a.diagnostico}</td>
                      <td style={{ maxWidth:200, fontSize:13 }}>{a.tratamiento}</td>
                      <td style={{ fontSize:12, whiteSpace:'nowrap' }}>
                        {new Date(a.created_at).toLocaleDateString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
        <div className="table-footer">{lista.length} atención(es) registrada(s)</div>
      </div>

      {modal && (
        <Modal titulo="Registrar atención médica" onClose={() => setModal(false)}>
          <div className="modal-body">
            {error && <div className="alert-custom alert-error"><i className="bi bi-exclamation-circle-fill"></i>{error}</div>}
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label-custom">Paciente *</label>
                <select className="form-control-custom" value={form.paciente_id}
                  onChange={e => setForm({ ...form, paciente_id:e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.apellidos}, {p.nombres}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label-custom">Médico tratante *</label>
                <select className="form-control-custom" value={form.medico_id}
                  onChange={e => setForm({ ...form, medico_id:e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label-custom">Diagnóstico *</label>
                <textarea className="form-control-custom" rows={2}
                  placeholder="Describe el diagnóstico del paciente..."
                  value={form.diagnostico} onChange={e => setForm({ ...form, diagnostico:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Tratamiento *</label>
                <textarea className="form-control-custom" rows={2}
                  placeholder="Indica el tratamiento prescrito..."
                  value={form.tratamiento} onChange={e => setForm({ ...form, tratamiento:e.target.value })} />
              </div>
              <div className="col-12">
                <label className="form-label-custom">Observaciones adicionales</label>
                <textarea className="form-control-custom" rows={2}
                  value={form.observaciones} onChange={e => setForm({ ...form, observaciones:e.target.value })} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-outline-custom" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary-custom" onClick={guardar}>
              <i className="bi bi-check2"></i>Registrar atención
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
