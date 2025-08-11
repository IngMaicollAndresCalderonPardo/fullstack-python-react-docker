// Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      api.get("/profile")
        .then((res) => {
          setUserName(res.data.full_name || "Usuario");
        })
        .catch((err) => {
          console.error("Error al obtener usuario:", err);
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Fullstack App
        </Link>

        {token && (
          <span className="navbar-text text-white me-3">
            👋 Hola, {userName}
          </span>
        )}

        <div>
          {!token ? (
            <>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-warning" to="/register">
                Registro
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light me-2" to="/profile">
                <i className="bi bi-person-lines-fill me-1"></i> Editar Perfil
              </Link>

              <Link className="btn btn-outline-light me-2" to="/posts">
                <i className="bi bi-card-text me-1"></i> Publicaciones
              </Link>

              <Link className="btn btn-outline-light me-2" to="/create-post">
                <i className="bi bi-pencil-square me-1"></i> Crear Publicaciones
              </Link>

              <button onClick={handleLogout} className="btn btn-danger">
                <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
