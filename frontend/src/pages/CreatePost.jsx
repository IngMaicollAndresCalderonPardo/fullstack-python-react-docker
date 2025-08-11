import { useState } from "react";
import { postsApi } from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await postsApi.post("/posts", { title, content });
      alert("✅ Publicación creada con éxito");
      setTitle("");
      setContent("");
      navigate("/posts");
    } catch (error) {
      console.error(error);

      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;

        if (detail) {
          if (Array.isArray(detail)) {
            const fieldErrors = {};
            detail.forEach((err) => {
              const field = err.loc?.[1] || "";
              fieldErrors[field] = err.msg;
            });
            setErrors(fieldErrors);
          } else if (typeof detail === "object") {
            setErrors(detail);
          }
        }
      }
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2 className="create-post-title">Crear publicación</h2>

        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            type="text"
            placeholder="Título"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title && (
            <small className="create-post-error">{errors.title}</small>
          )}

          <textarea
            placeholder="Escribe el contenido aquí..."
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          {errors.content && (
            <small className="create-post-error">{errors.content}</small>
          )}

          <button type="submit" className="create-post-button">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}
