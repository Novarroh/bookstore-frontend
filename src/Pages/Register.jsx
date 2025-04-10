import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(name, email, password);
  };
  const navigate = useNavigate();

  return (
    <div className="register-wrapper">
      <h2 className="register-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
          required
        />
        <button type="submit" className="register-button">
          Register
        </button>
        <p style={{ padding: "1rem" }}>
          Existing User Click on{" "}
          <span
            onClick={() => navigate("/Login")}
            style={{ color: "#28527a", fontWeight: "bold", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
