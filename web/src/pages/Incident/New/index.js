import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";
import logoImg from "../../../assets/logo.svg";

function NewIncident() {
  const ngoId = localStorage.getItem("ngoId");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const history = useHistory();

  async function handleNewIncident(event) {
    event.preventDefault();

    const data = { title, description, value };

    try {
      const response = await api.post("/incident", data, {
        headers: { authorization: ngoId },
      });

      if (response.status <= 201) {
        history.push("/profile");
      } else {
        throw Error(response);
      }
    } catch (error) {
      alert(error.args);
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Register new case</h1>
          <p>Describe the case with details to be solved by a hero.</p>
          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#e02041" />
            Back to homepage
          </Link>
        </section>
        <form onSubmit={handleNewIncident}>
          <input
            placeholder="Name of the case"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            placeholder="Value in dollar"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewIncident;
