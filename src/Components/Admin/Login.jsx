import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message || "Xatolik yuz berdi");
      setLoading(false);
    } else if (data) {
      navigate("/admin");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__card">
          <h1 className="login__title">Admin Login</h1>
          <p className="login__subtitle">Admin panelga kirish</p>

          <form onSubmit={handleSubmit} className="login__form">
            {error && <div className="login__error">{error}</div>}

            <div className="login__field">
              <label className="login__label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login__input"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="login__field">
              <label className="login__label">Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login__input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login__button"
              disabled={loading}
            >
              {loading ? "Kutilmoqda..." : "Kirish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

