// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PostsList from "./pages/PostsList";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
