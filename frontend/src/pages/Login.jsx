// src/pages/Login.jsx
import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Por favor completa todos los campos.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Ingresa un correo válido.");
      return;
    }
    if (password.length < 5) {
      setMessage("La contraseña debe tener al menos 5 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      localStorage.setItem("token", res.data.access_token);
      setMessage("Inicio de sesión correcto. Redirigiendo...");
      setTimeout(() => navigate("/posts"), 600);
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page minimal">
      <div className="auth-card xlarge"role="main"> 
        <h2 className="heading">Iniciar sesión</h2>
        <p className="sub">Accede a tu cuenta</p>

        {message && (
          <div
            className={`message ${
              message.toLowerCase().includes("correcto") ||
              message.toLowerCase().includes("redirigiendo")
                ? "success"
                : "error"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link to="/register" className="btn btn-primary">
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
