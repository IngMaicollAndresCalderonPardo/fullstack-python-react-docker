export default function PostsTable({ posts, onDelete, onOpenModal }) {
  return (
    <table className="posts-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Contenido</th>
          <th>Fecha</th>
          <th style={{ textAlign: "center" }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => {
          const fechaFormateada = new Date(post.created_at).toLocaleString("es-CO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                {post.content.length > 30 ? (
                  <>
                    {post.content.slice(0, 20)}...
                    <button
                      onClick={() => onOpenModal(post.content)}
                      className="btn-ver-mas"
                      aria-label={`Ver contenido completo de ${post.title}`}
                    >
                      Ver más
                    </button>
                  </>
                ) : (
                  post.content
                )}
              </td>
              <td>{fechaFormateada}</td>
              <td className="actions-cell" style={{ textAlign: "center" }}>
                <button
                  onClick={() => onDelete(post.id)}
                  className="btn-delete"
                  title="Eliminar publicación"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
