import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Welcome back, sister 🌸 You are logged in!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Welcome back, sister 🌸 You are logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ background: "#F3E8FF", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "white", padding: 30, borderRadius: 12, maxWidth: 400, width: "100%" }}>
        <h2 style={{ color: "#6B21A8", textAlign: "center" }}>Login 🌸</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", margin: "10px 0", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", margin: "10px 0", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleLogin}
          style={{ width: "100%", padding: 10, background: "#9D4EDD", color: "white", borderRadius: 6, marginTop: 10 }}
        >
          Login
        </button>
        <button
          onClick={handleGoogleLogin}
          style={{ width: "100%", padding: 10, background: "#6B21A8", color: "white", borderRadius: 6, marginTop: 10 }}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
