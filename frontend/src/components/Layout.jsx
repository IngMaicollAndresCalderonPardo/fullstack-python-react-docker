// Layout.jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="container flex-fill py-4">{children}</main>
    </div>
  );
}
