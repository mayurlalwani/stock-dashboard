import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const valid = email && /^\S+@\S+\.\S+$/.test(email);
    if (!valid) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    onLogin(email);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1 className="login-title">Welcome</h1>
        <p className="login-sub">Sign in to continue</p>

        <input
          className="login-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="email"
        />

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
