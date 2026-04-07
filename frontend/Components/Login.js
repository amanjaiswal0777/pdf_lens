import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL, { readJsonResponse } from "./api";
import "./style.css";

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.552c0-1.636-.132-3.196-.38-4.692H24.48v9.01h13.012c-.576 3.016-2.272 5.572-4.832 7.288v6.048h7.82c4.572-4.212 7.052-10.42 7.052-17.654z" fill="#4285F4" />
    <path d="M24.48 48c6.516 0 11.988-2.164 15.984-5.856l-7.82-6.048c-2.164 1.452-4.928 2.308-8.164 2.308-6.276 0-11.592-4.24-13.492-9.94H2.916v6.244C6.9 42.82 15.132 48 24.48 48z" fill="#34A853" />
    <path d="M10.988 28.464A14.46 14.46 0 0 1 10.24 24c0-1.564.268-3.08.748-4.464v-6.244H2.916A23.948 23.948 0 0 0 .48 24c0 3.876.924 7.548 2.436 10.708l8.072-6.244z" fill="#FBBC05" />
    <path d="M24.48 9.596c3.536 0 6.708 1.216 9.2 3.604l6.892-6.892C36.46 2.392 30.996 0 24.48 0 15.132 0 6.9 5.18 2.916 13.292l8.072 6.244c1.9-5.7 7.216-9.94 13.492-9.94z" fill="#EA4335" />
  </svg>
);

const LOGO_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function FieldInput({ label, type, value, onChange, placeholder, onFocus, onBlur }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className="field-input"
      />
    </div>
  );
}

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError("");
  };

  const signIn = (token) => {
    window.sessionStorage.setItem("token", token);
    setToken(token);
    navigate("/");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await readJsonResponse(res);

      if (!res.ok) {
        throw new Error(data.msg || data.error || "Login failed");
      }

      signIn(data.token);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setError("Google sign-in is not configured yet.");
    }, 1600);
  };

  return (
    <div className="page-wrapper">
      <div className="orb orb--purple" />
      <div className="orb orb--blue" />
      <div className="orb orb--violet" />
      <div className="grid-overlay" />

      <div className="card">
        <div className="logo">
          <div className="logo__icon">{LOGO_ICON}</div>
          <span className="logo__name">PDF_Lens</span>
        </div>

        <div className="heading-block">
          <h1>Welcome back</h1>
          <p>Sign in to summarize your documents.</p>
        </div>

        <button className="btn-google" onClick={googleLogin} disabled={googleLoading}>
          {googleLoading ? <span className="spinner" /> : GOOGLE_ICON}
          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="divider">
          <div className="divider__line" />
          <span className="divider__label">OR</span>
          <div className="divider__line" />
        </div>

        <form className="form" onSubmit={submit}>
          <div className="field-row">
            <FieldInput
              label="Email"
              type="email"
              value={form.email}
              onChange={handle("email")}
              placeholder="your_email@example.com"
              onFocus={(e) => e.target.classList.add("field-input--focused")}
              onBlur={(e) => e.target.classList.remove("field-input--focused")}
            />
          </div>

          <div className="field-row">
            <FieldInput
              label="Password"
              type="password"
              value={form.password}
              onChange={handle("password")}
              placeholder="........"
              onFocus={(e) => e.target.classList.add("field-input--focused")}
              onBlur={(e) => e.target.classList.remove("field-input--focused")}
            />
          </div>

          <div className="forgot-wrap">
            <button type="button" className="link-btn link-btn--muted">
              Forgot password?
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="toggle-row">
          Don't have an account?{" "}
          <button type="button" className="link-btn link-btn--accent" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
