import { Link } from "react-router-dom";

export default function Home() {
  // Revisa si hay token guardado (puedes ajustar según cómo lo guardas)
  const token = localStorage.getItem("token");

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 fw-bold text-primary">
        Bienvenido a la App Fullstack - Prueba Finanzauto
      </h1>
      <p className="text-center lead">
        Esta aplicación te permitirá gestionar tu perfil y tus publicaciones.
      </p>

      {/* Carrusel explicativo */}
      <div id="featuresCarousel" className="carousel slide mt-4" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#featuresCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#featuresCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#featuresCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div className="carousel-inner rounded shadow">
          {/* Slide 1 */}
          <div className="carousel-item active bg-light p-5 text-center">
            <i className="bi bi-person-plus display-1 text-primary"></i>
            <h3 className="mt-3 fw-bold">Registro y Autenticación</h3>
            <p className="mt-2">
              Crea una cuenta nueva o inicia sesión utilizando tu correo y contraseña. 
              El sistema valida credenciales con autenticación JWT.
            </p>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item bg-light p-5 text-center">
            <i className="bi bi-person-badge display-1 text-success"></i>
            <h3 className="mt-3 fw-bold">Gestión de Perfil</h3>
            <p className="mt-2">
              Consulta y edita tu información personal (nombre y correo). 
              Se aplican validaciones para garantizar datos correctos y seguros.
            </p>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item bg-light p-5 text-center">
            <i className="bi bi-card-text display-1 text-warning"></i>
            <h3 className="mt-3 fw-bold">Publicaciones</h3>
            <p className="mt-2">
              Crea, lista y elimina publicaciones asociadas a tu cuenta.
              Solo usuarios autenticados pueden realizar estas acciones.
            </p>
          </div>
        </div>

        {/* Controles */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#featuresCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#featuresCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Mostrar botones solo si NO hay token */}
      {!token && (
        <div className="mt-4 d-flex justify-content-center gap-3">
          <Link to="/register" className="btn btn-success btn-lg">
            <i className="bi bi-person-plus-fill me-2"></i> Registrarse
          </Link>
          <Link to="/login" className="btn btn-primary btn-lg">
            <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
          </Link>
        </div>
      )}
    </div>
  );
}
