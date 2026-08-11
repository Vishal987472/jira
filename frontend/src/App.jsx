import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./components/layout/AppLayout";
import Tasks from "./pages/Tasks.jsx";

function App() {

  return (
      <Routes>

        <Route
            path="/login"
            element={<Login />}
        />

        <Route
            path="/register"
            element={<Register />}
        />

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

              <Route
                  path="/tasks"
                  element={<Tasks />}
              />

          </Route>

        </Route>

        <Route
            path="/"
            element={
              <Navigate
                  to="/dashboard"
                  replace
              />
            }
        />

        <Route
            path="*"
            element={
              <Navigate
                  to="/dashboard"
                  replace
              />
            }
        />

      </Routes>
  );
}

export default App;