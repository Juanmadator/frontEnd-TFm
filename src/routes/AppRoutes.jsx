import { Routes, Route, useLocation } from "react-router-dom";
import { Login } from "../features/auth/Login";
import { Register } from "../features/auth/Register";
import { App } from "../App";
import NavbarMenu from "../components/Navbar/NavbarMenu";
import ProtectedRoute from "../components/ProtectedRoute";
import { Perfil } from "../components/Profile/Profile";
import Footer from "../components/Footer/Footer";
import { CreateCompany } from "../components/CrearEmpresa/CrearEmpresa";
import Empresas from "../pages/Empresas";
import OfertasTrabajo from "../pages/OfertaTrabajo";

function Layout({ children }) {
  const location = useLocation();

  const noNavbarRoutes = ["/login", "/register"];

  const noFooterRoutes = ["/login", "/register"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);
  const showFooter = !noFooterRoutes.includes(location.pathname);
  return (
    <>
      {showNavbar && <NavbarMenu />}
      <main>{children}</main>

      {showFooter && <Footer />}
    </>
  );
}

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/crear" element={<CreateCompany />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/empresas"
          element={
            <ProtectedRoute>
              <Empresas />
            </ProtectedRoute>
          }
        />

            <Route
          path="/ofertas"
          element={
            <ProtectedRoute>
              <OfertasTrabajo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
