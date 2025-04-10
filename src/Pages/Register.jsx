// File: src/components/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const payload = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      password: password,
    };
    console.log("payload",payload)
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
        return;
      }

      const data = await response.json();
      onRegister(data);
      navigate("/Login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-wrapper">
      <h2 className="register-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="register-input"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="register-button">
          Register
        </button>
        <p style={{ padding: "1rem" }}>
          Existing User? Click on{' '}
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
