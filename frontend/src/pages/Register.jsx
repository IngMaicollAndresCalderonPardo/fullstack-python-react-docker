import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState(""); // nuevo
  const [address, setAddress] = useState("");     // nuevo
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const localErrors = [];
    if (!username.trim()) localErrors.push("El nombre de usuario es obligatorio.");
    if (!/\S+@\S+\.\S+/.test(email)) localErrors.push("Ingresa un correo electrónico válido.");
    if (password.length < 5) localErrors.push("La contraseña debe tener al menos 5 caracteres.");
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) localErrors.push("El número de teléfono debe contener exactamente 10 dígitos.");
    // Validación básica de fecha (YYYY-MM-DD)
    if (birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) localErrors.push("La fecha de nacimiento debe estar en formato AAAA-MM-DD.");

    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email,
        password,
        full_name: username,
        phone_number: phoneNumber,
        birth_date: birthDate,
        address,
      });
      setErrors(["✅ Registro exitoso, redirigiendo al inicio de sesión..."]);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const backendErrors = [];

      if (error?.response?.status === 422 && Array.isArray(error.response.data?.detail)) {
        error.response.data.detail.forEach((err) => {
          if (err.msg.includes("at least 8 characters")) {
            backendErrors.push("La contraseña debe tener al menos 8 caracteres.");
          } else {
            backendErrors.push(err.msg);
          }
        });
      } else {
        const msg = error?.response?.data?.detail || "Error al registrarse.";
        backendErrors.push(msg);
      }

      const uniqueErrors = [...new Set(backendErrors)];
      setErrors(uniqueErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page minimal">
      <div className="auth-card large">
        <h2 className="heading">Registro</h2>
        <p className="sub">Crea una cuenta para comenzar</p>

        {errors.length > 0 && (
          <div className={`message ${errors[0].startsWith("✅") ? "success" : "error"}`}>
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {errors.map((err, idx) => (<li key={idx}>{err}</li>))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-two-columns">
          <div className="form-field">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              className="input"
              type="text"
              placeholder="Tu nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber">Número de teléfono</label>
            <input
              id="phoneNumber"
              className="input"
              type="text"
              placeholder="10 dígitos"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              maxLength={10}
            />
          </div>

          <div className="form-field">
            <label htmlFor="birthDate">Fecha de nacimiento</label>
            <input
              id="birthDate"
              className="input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="address">Dirección</label>
            <input
              id="address"
              className="input"
              type="text"
              placeholder="Tu dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Mínimo 5 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="btn-row full-width">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
            <Link to="/login" className="btn btn-primary">
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
