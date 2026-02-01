import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../api";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
  api.auth
      .signup(name, admissionNo, password)
      .then((user) => {
  navigate("/complete-profile", {
    state: { userId: user.id || user.id },
  });
})

      .catch(() => {
        alert("Sign up failed");
      });
  };

  return (
    <main className="auth-page">
      <form className="auth-card group-form" onSubmit={handleSignUp}>
        <h2>Create Student Account</h2>
<div className="form-field">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        </div>
<div className="form-field">
        <input
          type="text"
          placeholder="Admission Number"
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
<div className="auth-button">
        <button type="submit">Sign Up</button>
</div>
        <p className="auth-link">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default SignUpPage;
