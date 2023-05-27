import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../../services/api";
import "./styles.css";
import logoImg from "../../assets/logo.svg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const history = useHistory();

  async function handleRegister(event) {
    event.preventDefault();

    const data = { name, email, password, whatsapp, city, state };

    try {
      const response = await api.post("/ngo", data);

      if (response === undefined || response === null) {
        throw Error("Error when trying to receive response from server");
      }

      if (response.status > 201) {
        return alert(`ERROR ${response.status}: ${response.statusText}`);
      } else {
        return history.push("/"); // redirect user to login page
      }
    } catch (error) {
      return alert(error.args);
    }
  }

  // HTML returned when the component is rendered
  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Register</h1>
          <p>Enroll and help people to find and help your NGO</p>
          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#e02041" />
            Back to login
          </Link>
        </section>
        <form onSubmit={handleRegister}>
          <input
            placeholder="NGO name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="number"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <div className="input-group">
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="ST"
              style={{ width: 80 }}
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <button className="button" type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
