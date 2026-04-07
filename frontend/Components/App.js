import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import SignUp from "./Signup";
import Main from "./Main";

function ProtectedRoute({ children, token }) {
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [token, setToken] = useState(() => window.sessionStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" replace /> : <SignUp setToken={setToken} />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute token={token}>
              <Main setToken={setToken} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
