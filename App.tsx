import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { appRoutes } from "./routes/routes";
import { ComponentType } from "react";


function App() {

  const handleLogin = () => {
  console.log("Usuário logado!");
  };
  
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Navigate to="/login" />} />
        {/* Rota pública */}
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />

        {/* Rotas protegidas com layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {appRoutes.map((route) => {
            const Component = route.component;

            let user = null;

            try {
              const storedUser =
                localStorage.getItem("user");

              user =
                storedUser &&
                storedUser !== "undefined"
                  ? JSON.parse(storedUser)
                  : null;
            } catch (error) {
              console.error(
                "Erro ao ler user do localStorage",
                error
              );

              localStorage.removeItem(
                "user"
              );
            }

            const isAdmin =
              user?.role?.toLowerCase() ===
              "admin";
            
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.adminOnly &&
                  !isAdmin ? (
                    <Navigate
                      to="/pos"
                      replace
                    />
                  ) : (
                    <Component />
                  )
                }
              />
            );
          })}
        </Route>
      </Routes> 
    </HashRouter>
  );
}

export default App;
