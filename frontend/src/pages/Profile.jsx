import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { validateProfileForm } from "../utils/validation";
import "../styles/profile.css";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/profile");
        setFullName(res.data.full_name ?? "");
        setEmail(res.data.email ?? "");
        setPhoneNumber(res.data.phone_number ?? "");
        setBirthDate(res.data.birth_date ?? "");
        setAddress(res.data.address ?? "");
      } catch (err) {
        console.error("Error cargando perfil:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setMessage("No se pudo cargar el perfil. Intenta luego.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const errors = validateProfileForm({
      fullName,
      email,
      phoneNumber,
      birthDate,
    });

    if (errors.length > 0) {
      setMessage(errors[0]);
      return;
    }

    try {
      await api.put("/profile", {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        birth_date: birthDate,
        address,
      });
      setMessage("Perfil actualizado correctamente.");
    } catch (err) {
      if (err?.response?.status === 422 && err.response.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const friendlyErrors = detail.map((error) => {
            if (error.msg.includes("Input should be a valid date or datetime")) {
              return "La fecha debe ser una fecha válida.";
            }
            return error.msg;
          });
          setMessage(friendlyErrors[0] || "Error de validación");
        } else {
          setMessage(JSON.stringify(detail));
        }
      } else {
        const msg = err?.response?.data?.detail || "Error al actualizar perfil";
        setMessage(msg);
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Cargando perfil...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Editar Perfil</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("correctamente") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="mb-3 full-width">
            <label>Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 full-width">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Número de teléfono</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              maxLength={10}
              placeholder="10 dígitos"
            />
          </div>

          <div className="mb-3">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div className="mb-3 full-width">
            <label>Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Tu dirección"
            />
          </div>

          <button type="submit" className="create-post-button">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}
