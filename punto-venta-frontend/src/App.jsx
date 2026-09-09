import { Routes, Route, Link } from "react-router-dom";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";

function App() {
  return (
    <>
      <header style={{ padding: "10px", backgroundColor: "#1e1e1e", marginBottom: "20px" }}>
        <nav style={{ display: "flex", gap: "15px" }}>
          <Link to="/categorias" style={{ color: "#fff", textDecoration: "none" }}>Categorías</Link>
          <Link to="/clientes" style={{ color: "#fff", textDecoration: "none" }}>Clientes</Link>
          <Link to="/productos" style={{ color: "#fff", textDecoration: "none" }}>Productos</Link>
        </nav>
      </header>

      <main style={{ padding: "0 20px" }}>
        <Routes>
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/" element={<Categorias />} />
        </Routes>
      </main>
    </>
  );
}

export default App;