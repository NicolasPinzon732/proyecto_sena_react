const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d+$/;

export function validarCampoRegistro(campo, valor, formData = {}) {
  const texto = valor.trim();

  if ((campo === 'nombres' || campo === 'apellidos') && texto && !NOMBRE_REGEX.test(texto)) {
    return campo === 'nombres' ? 'Los nombres solo pueden contener letras.' : 'Los apellidos solo pueden contener letras.';
  }

  if (campo === 'email' && texto && !EMAIL_REGEX.test(texto)) {
    return 'Ingresa un correo válido con @.';
  }

  if (campo === 'telefono' && texto && !TELEFONO_REGEX.test(texto)) {
    return 'El teléfono solo puede contener números.';
  }

  if (campo === 'password' && valor && valor.length < 8) {
    return 'La contraseña debe tener mínimo 8 caracteres.';
  }

  if (campo === 'confirmPassword' && valor && valor !== formData.password) {
    return 'Las contraseñas no coinciden.';
  }

  return '';
}

export function validarRegistroCompleto(formData) {
  const errores = {};
  const campos = ['nombres', 'apellidos', 'email', 'telefono', 'password', 'confirmPassword'];

  campos.forEach((campo) => {
    const error = validarCampoRegistro(campo, formData[campo] || '', formData);
    if (error) errores[campo] = error;
  });

  return errores;
}
