import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import SignUp from "./Signup";
import Main from "./Main";

const FAKE_TOKEN = "123456";

function isAuthorized() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem("authToken") === FAKE_TOKEN;
}

function ProtectedRoute({ children }) {
  if (!isAuthorized()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
   
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
