export default function PostsSearch({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Buscar publicaciones..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="posts-search"
      aria-label="Buscar publicaciones"
    />
  );
}
