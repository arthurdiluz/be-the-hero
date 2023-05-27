import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";
import { FiLogIn } from "react-icons/fi";
import "./styles.css";
import logoImg from "../../assets/logo.svg";
import heroesImg from "../../assets/heroes.png";

function Logon() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  // listener function to do the login
  async function handleLogon(event) {
    event.preventDefault();

    try {
      const response = await api.post("/session", { email, password });

      // Stores id and name from ngo into the browser's local storage
      localStorage.setItem("ngoId", response.data["id"]);
      localStorage.setItem("ngoName", response.data["name"]);

      // redirect user to profile page
      history.push("/profile");
    } catch (error) {
      alert(error.args);
    }
  }

  // HTML returned when the component is rendered
  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />
        <form onSubmit={handleLogon}>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Get in
          </button>
          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#e02041" />I am not enrolled
          </Link>
        </form>
      </section>
      <img src={heroesImg} alt="Heroes" />
    </div>
  );
}

// export component
export default Logon;
