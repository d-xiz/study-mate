import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {api } from "../api";
import { useLocation } from "react-router-dom";


const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!admissionNo.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;

  }

   api.auth
      .login(admissionNo, password)
      .then((user) => {
  localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
        const wantsTutor = location.state?.wantsTutor;
        if (wantsTutor) {
          navigate("/become-tutor");
        } else {  
        navigate("/");
        }
      })
      .catch(() => {
        alert("Invalid login");
      });
  };

  return (
    <main className="auth-page group-form">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Student Login</h2>
<div className="form-field">
        <input
          type="text"
          placeholder="Admission Number (e.g. TP012345)"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          required
        />
        </div>
<div className="form-field">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
{error && <p className="auth-error">{error}</p>}

<div className="auth-button">
        <button type="submit">Login</button>
</div>
        <p className="auth-link">
          New student? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
