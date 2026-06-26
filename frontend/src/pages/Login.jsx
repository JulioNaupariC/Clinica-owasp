import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMOS = [
  { rol: 'Admin',        email: 'admin@clinica.pe',  pass: 'Admin1234'  },
  { rol: 'Médico',       email: 'medico@clinica.pe', pass: 'Medico1234' },
  { rol: 'Recepción',    email: 'recep@clinica.pe',  pass: 'Recep1234'  },
];

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="icon-wrap"><i className="bi bi-hospital"></i></div>
          <h1>Sistema Clínica</h1>
          <p>Gestión segura de información médica</p>
          <div className="owasp-tag">
            <i className="bi bi-shield-check"></i>
            OWASP Top 10 2021 Implementado
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-custom alert-error">
            <i className="bi bi-exclamation-circle-fill" style={{ flexShrink: 0 }}></i>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label-custom">Correo electrónico</label>
            <input
              type="email" className="form-control-custom"
              placeholder="usuario@clinica.pe"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label className="form-label-custom">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-control-custom"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
                style={{ paddingRight: 42 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:16 }}>
                <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary-custom"
            style={{ width:'100%', justifyContent:'center', padding:'11px 0', fontSize:14 }}
            disabled={loading}>
            {loading
              ? <><i className="bi bi-hourglass-split"></i> Ingresando...</>
              : <><i className="bi bi-box-arrow-in-right"></i> Ingresar al sistema</>
            }
          </button>
        </form>

        {/* Demo accounts */}
        <div style={{ marginTop:24, padding:'14px 16px', background:'#f8fafc',
          borderRadius:10, border:'1px solid #e2e8f0' }}>
          <p style={{ fontSize:11, fontWeight:700, color:'#64748b', marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px' }}>
            Cuentas de demostración
          </p>
          {DEMOS.map(d => (
            <div key={d.rol}
              onClick={() => { setEmail(d.email); setPassword(d.pass); }}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'5px 0', cursor:'pointer', borderBottom:'1px solid #f1f5f9' }}>
              <span style={{ fontSize:12, fontWeight:600, color:'#0f4c81' }}>{d.rol}</span>
              <span style={{ fontSize:11, color:'#64748b' }}>{d.email}</span>
            </div>
          ))}
          <p style={{ fontSize:10, color:'#94a3b8', marginTop:7 }}>
            Haz clic en una cuenta para autocompletar
          </p>
        </div>

      </div>
    </div>
  );
}
