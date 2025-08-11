import { useEffect, useState } from "react";
import { postsApi } from "../api/axios";
import PostsSearch from "../components/PostsSearch";
import PostsTable from "../components/PostsTable";
import Modal from "../components/Modal";
import "../styles/PostsList.css";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await postsApi.get("/posts");
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al cargar publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    try {
      await postsApi.delete(`/posts/${id}`);
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setFilteredPosts(
        updatedPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(search.toLowerCase()) ||
            post.content.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la publicación");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(lowerSearch) ||
            post.content.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [search, posts]);

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 40, color: "#555" }}>
        Cargando publicaciones...
      </p>
    );
  }

  return (
    <div className="posts-container">
      <div className="posts-wrapper">
        <h2 className="posts-title">Publicaciones</h2>

        <PostsSearch search={search} setSearch={setSearch} />

        {filteredPosts.length === 0 ? (
          <p className="posts-no-results">No hay publicaciones que coincidan.</p>
        ) : (
          <PostsTable
            posts={filteredPosts}
            onDelete={deletePost}
            onOpenModal={openModal}
          />
        )}

        <Modal isOpen={modalContent !== null} onClose={closeModal} title="Contenido completo">
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{modalContent}</p>
        </Modal>
      </div>
    </div>
  );
}
