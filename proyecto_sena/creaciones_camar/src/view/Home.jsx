import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { validarCampoRegistro, validarRegistroCompleto } from '../utils/validacionesRegistro';

const productos = [
  {
    categoria: 'Deportiva',
    nombre: 'Chaqueta deportiva',
    precio: '$120.000',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxVcuU1LPIx39RyZbavET77zpepMW8kpWuWHv2m7gNOnto_cIUlmyJCLw&s=10',
  },
  {
    categoria: 'Cuero',
    nombre: 'Chaqueta de cuero',
    precio: '$200.000',
    imagen: 'https://genomacol.com/cdn/shop/files/IMG_9168.jpg?v=1743399397',
  },
  {
    categoria: 'Denim',
    nombre: 'Chaqueta denim',
    precio: '$145.000',
    imagen: 'https://americaneagle.vtexassets.com/arquivos/ids/8541809-800-auto?v=638914021549400000&width=800&height=auto&aspect=true',
  },
];

const valores = [
  { icono: '✓', titulo: 'Calidad garantizada' },
  { icono: '★', titulo: 'Atención personalizada' },
  { icono: '◈', titulo: 'Diseños exclusivos' },
  { icono: '⌁', titulo: 'Compromiso y confianza' },
];

const getHomeRouteByRole = (rol) => {
  const role = String(rol || '').trim().toLowerCase();

  if (role === 'admin') return '/admin';
  if (role === 'empleado') return '/empleado';
  return '/cliente/catalogo';
};

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('salida-confirmada') !== 'true') return undefined;

    window.history.pushState(null, '', window.location.href);
    const impedirRegresoAlLogin = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', impedirRegresoAlLogin);

    return () => window.removeEventListener('popstate', impedirRegresoAlLogin);
  }, []);

  return (
    <main className="home-page">
      <header className="home-header">
        <a className="home-logo" href="#inicio" aria-label="Creaciones Camar, inicio">
          Creaciones Camar
        </a>

        <nav className="home-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button type="button" className="home-login" onClick={() => setLoginOpen(true)}>Iniciar sesión</button>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-hero__content">
          <p className="home-eyebrow">Nueva colección 2026</p>
          <h1>Colección de <em>chaquetas</em></h1>
          <p className="home-hero__copy">
            Diseños exclusivos, materiales premium y la mejor calidad para cualquier ocasión.
          </p>
          <div className="home-actions">
            <a href="#productos" className="home-button home-button--solid">Ver catálogo</a>
            <button type="button" className="home-button home-button--light" onClick={() => setLoginOpen(true)}>Comprar ahora</button>
          </div>
        </div>
        <a className="home-scroll" href="#productos" aria-label="Explorar productos">
          <span>Explorar</span><span aria-hidden="true">↓</span>
        </a>
      </section>

      <section className="home-values" aria-label="Nuestros valores">
        {valores.map((valor) => (
          <div className="home-value" key={valor.titulo}>
            <span className="home-value__icon" aria-hidden="true">{valor.icono}</span>
            <span>{valor.titulo}</span>
          </div>
        ))}
      </section>

      <section className="home-products" id="productos">
        <div className="home-section-heading">
          <p className="home-eyebrow home-eyebrow--dark">Selección de temporada</p>
          <h2>Productos destacados</h2>
          <p>Prendas pensadas para acompañarte con estilo, comodidad y carácter.</p>
        </div>

        <div className="home-product-grid">
          {productos.map((producto) => (
            <article className="home-product-card" key={producto.nombre}>
              <div className="home-product-card__image-wrap">
                <img src={producto.imagen} alt={producto.nombre} />
                <span>{producto.categoria}</span>
              </div>
              <div className="home-product-card__body">
                <h3>{producto.nombre}</h3>
                <p>{producto.precio}</p>
                <button type="button" className="home-card-link" onClick={() => setLoginOpen(true)}>Ver más <span aria-hidden="true">↗</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-about" id="nosotros">
        <div className="home-about__label">Desde 2024</div>
        <div>
          <p className="home-eyebrow home-eyebrow--dark">Nuestra esencia</p>
          <h2>Hecho para expresar quién eres.</h2>
          <p>
            En Creaciones Camar diseñamos y fabricamos chaquetas con materiales de alta calidad,
            combinando elegancia, comodidad y durabilidad para crear prendas únicas.
          </p>
        </div>
      </section>

      <footer className="home-footer" id="contacto">
        <div>
          <p className="home-logo">Creaciones Camar</p>
          <p>Moda, calidad y estilo.</p>
        </div>
        
        <a href="mailto:creacionescamarsena@gmail.com">creacionescamarsena@gmail.com</a>
      </footer>

      {loginOpen && <AuthModal onClose={() => setLoginOpen(false)} />}
    </main>
  );
}

function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', telefono: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setFieldErrors({});
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    const nextFormData = { ...formData, [name]: value };
    setFormData(nextFormData);
    setFieldErrors((previous) => ({ ...previous, [name]: validarCampoRegistro(name, value, { ...nextFormData, password }) }));
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
    setFieldErrors((previous) => ({ ...previous, email: validarCampoRegistro('email', value) }));
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    setFieldErrors((previous) => ({
      ...previous,
      password: validarCampoRegistro('password', value),
      confirmPassword: formData.confirmPassword
        ? validarCampoRegistro('confirmPassword', formData.confirmPassword, { password: value })
        : '',
    }));
  };

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8080/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Correo o contraseña incorrectos.');
    }

    const usuario = { ...data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(usuario));
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', data.token);
    sessionStorage.removeItem('salida-confirmada');
    navigate(getHomeRouteByRole(data.user?.rol));
  };

  const handleRegister = async () => {
    const errores = validarRegistroCompleto({ ...formData, email, password });
    if (Object.keys(errores).length) throw new Error(Object.values(errores)[0]);

    const response = await fetch('http://localhost:8080/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email,
        telefono: formData.telefono || '',
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la cuenta.');
    }

    setSuccess('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
    setTimeout(() => changeMode('login'), 1500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') await handleLogin();
      else await handleRegister();
    } catch (authError) {
      setError(authError.message || 'No se pudo conectar con el servidor');
      console.error(authError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="login-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <button type="button" className="login-modal__close" onClick={onClose} aria-label="Cerrar inicio de sesión">×</button>
        <p className="home-eyebrow home-eyebrow--dark">{mode === 'login' ? 'Bienvenido de nuevo' : 'Únete a nosotros'}</p>
        <h2 id="login-modal-title">{mode === 'login' ? 'Inicia sesión' : 'Crear cuenta'}</h2>
        <p className="login-modal__intro">
          {mode === 'login' ? 'Accede a tu cuenta para continuar con tu compra.' : 'Regístrate para descubrir nuestras colecciones.'}
        </p>

        {error && <div className="login-modal__error" role="alert">{error}</div>}
        {success && <div className="login-modal__success" role="status">{success}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="login-modal__names">
              <div>
                <label htmlFor="modal-nombres">Nombres</label>
                <input id="modal-nombres" name="nombres" type="text" value={formData.nombres} onChange={handleRegisterChange} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+" title="Solo se permiten letras" required />
                {fieldErrors.nombres && <small className="register-field-error">{fieldErrors.nombres}</small>}
              </div>
              <div>
                <label htmlFor="modal-apellidos">Apellidos</label>
                <input id="modal-apellidos" name="apellidos" type="text" value={formData.apellidos} onChange={handleRegisterChange} pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+" title="Solo se permiten letras" required />
                {fieldErrors.apellidos && <small className="register-field-error">{fieldErrors.apellidos}</small>}
              </div>
            </div>
          )}

          <label htmlFor="modal-email">Correo electrónico</label>
          <input id="modal-email" name="email" type="email" value={email} onChange={handleEmailChange} placeholder="tu@email.com" pattern="[^\s@]+@[^\s@]+\.[^\s@]+" title="Ingresa un correo válido con @" required />
          {mode === 'register' && fieldErrors.email && <small className="register-field-error">{fieldErrors.email}</small>}

          {mode === 'register' && (
            <>
              <label htmlFor="modal-telefono">Teléfono</label>
              <input id="modal-telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleRegisterChange} pattern="[0-9]+" title="Solo se permiten números" />
              {fieldErrors.telefono && <small className="register-field-error">{fieldErrors.telefono}</small>}
            </>
          )}

          <label htmlFor="modal-password">Contraseña</label>
          <input id="modal-password" name="password" type="password" value={password} onChange={handlePasswordChange} placeholder="Mínimo 8 caracteres" minLength="8" required />
          {mode === 'register' && fieldErrors.password && <small className="register-field-error">{fieldErrors.password}</small>}

          {mode === 'register' && (
            <>
              <label htmlFor="modal-confirm-password">Confirmar contraseña</label>
              <input id="modal-confirm-password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleRegisterChange} placeholder="Repite tu contraseña" minLength="8" required />
              {fieldErrors.confirmPassword && <small className="register-field-error">{fieldErrors.confirmPassword}</small>}
            </>
          )}

          <button type="submit" className="login-modal__submit" disabled={loading}>
            {loading ? (mode === 'login' ? 'Iniciando sesión...' : 'Creando cuenta...') : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
          </button>
        </form>

        <button type="button" className="login-modal__switch" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? '¿No tienes una cuenta? Crear cuenta' : '¿Ya tienes una cuenta? Iniciar sesión'}
        </button>
      </section>
    </div>
  );
}