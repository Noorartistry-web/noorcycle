import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Welcome, sister 🌸 Your account has been created!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Welcome, sister 🌸 You are logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ background: "#F3E8FF", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "white", padding: 30, borderRadius: 12, maxWidth: 400, width: "100%" }}>
        <h2 style={{ color: "#6B21A8", textAlign: "center" }}>Sign Up 🌸</h2>
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
          onClick={handleSignup}
          style={{ width: "100%", padding: 10, background: "#9D4EDD", color: "white", borderRadius: 6, marginTop: 10 }}
        >
          Sign Up
        </button>
        <button
          onClick={handleGoogleSignup}
          style={{ width: "100%", padding: 10, background: "#6B21A8", color: "white", borderRadius: 6, marginTop: 10 }}
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
