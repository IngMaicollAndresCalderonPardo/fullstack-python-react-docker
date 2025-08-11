// src/utils/validation.js
export function validateEmail(email) {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Ingresa un correo electrónico válido.";
  }
  return null;
}

export function validateUsername(username) {
  if (!username.trim()) {
    return "El nombre de usuario es obligatorio.";
  }
  return null;
}

export function validatePassword(password) {
  if (password.length < 5) {
    return "La contraseña debe tener al menos 5 caracteres.";
  }
  return null;
}

export function validatePhoneNumber(phoneNumber) {
  if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
    return "El número de teléfono debe contener exactamente 10 dígitos.";
  }
  return null;
}

export function validateBirthDate(birthDate) {
  if (birthDate) {
    const date = new Date(birthDate);
    if (date.toString() === "Invalid Date") {
      return "Fecha de nacimiento inválida.";
    }
  }
  return null;
}

export function validateProfileForm({ fullName, email, phoneNumber, birthDate }) {
  const errors = [];
  const usernameErr = validateUsername(fullName);
  if (usernameErr) errors.push(usernameErr);

  const emailErr = validateEmail(email);
  if (emailErr) errors.push(emailErr);

  const phoneErr = validatePhoneNumber(phoneNumber);
  if (phoneErr) errors.push(phoneErr);

  const birthDateErr = validateBirthDate(birthDate);
  if (birthDateErr) errors.push(birthDateErr);

  return errors;
}
