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
    <HashRouter basename="/sales_lideranca">
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
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Component />}
              />
            );
          })}
        </Route>
      </Routes> 
    </HashRouter>
  );
}

export default App;
