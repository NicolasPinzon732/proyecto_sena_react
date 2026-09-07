const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\+?\d{7,15}$/;
const NUIP_REGEX = /^\d{4,15}$/;

function limpiarTexto(valor) {
  return String(valor ?? '').trim();
}

export function validarCampoRegistro(campo, valor, formData = {}) {
  const texto = limpiarTexto(valor);

  if (campo === 'nombres' || campo === 'apellidos') {
    if (!texto) {
      return campo === 'nombres' ? 'El nombre es obligatorio.' : 'El apellido es obligatorio.';
    }
    if (!NOMBRE_REGEX.test(texto)) {
      return campo === 'nombres' ? 'Los nombres solo pueden contener letras y espacios.' : 'Los apellidos solo pueden contener letras y espacios.';
    }
    if (texto.length < 2) {
      return campo === 'nombres' ? 'El nombre debe tener al menos 2 caracteres.' : 'El apellido debe tener al menos 2 caracteres.';
    }
  }

  if (campo === 'nuip') {
    if (!texto) {
      return 'El NUIP es obligatorio.';
    }
    if (!NUIP_REGEX.test(texto)) {
      return 'El NUIP debe contener solo números y tener entre 4 y 15 dígitos.';
    }
  }

  if (campo === 'email') {
    if (!texto) {
      return 'El correo es obligatorio.';
    }
    if (!EMAIL_REGEX.test(texto)) {
      return 'Ingresa un correo válido con formato usuario@dominio.com.';
    }
  }

  if (campo === 'telefono') {
    if (texto && !TELEFONO_REGEX.test(texto)) {
      return 'El teléfono debe contener entre 7 y 15 dígitos y puede incluir el prefijo +.';
    }
  }

  if (campo === 'password') {
    if (!valor) {
      return 'La contraseña es obligatoria.';
    }
    if (valor.length < 8) {
      return 'La contraseña debe tener mínimo 8 caracteres.';
    }
    if (!/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/\d/.test(valor)) {
      return 'La contraseña debe incluir mayúscula, minúscula y número.';
    }
  }

  if (campo === 'confirmPassword' && valor && valor !== formData.password) {
    return 'Las contraseñas no coinciden.';
  }

  if (campo === 'confirmPassword' && !valor) {
    return 'Confirma la contraseña.';
  }

  return '';
}

export function validarRegistroCompleto(formData) {
  const errores = {};
  const campos = ['nombres', 'apellidos', 'nuip', 'email', 'telefono', 'password', 'confirmPassword'];

  campos.forEach((campo) => {
    const error = validarCampoRegistro(campo, formData[campo] || '', formData);
    if (error) errores[campo] = error;
  });

  if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    errores.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errores;
}
