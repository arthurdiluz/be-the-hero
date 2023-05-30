import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../../services/api";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";
import logoImg from "../../../assets/logo.svg";

function NewIncident() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access_token")
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    setAccessToken(localStorage.getItem("access_token"));
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return history.push("/");
    }
  }, [accessToken, history]);

  function handleNewIncident(event) {
    event.preventDefault();

    const data = { title, description, value };

    api
      .post("/incident", data, { headers: { access_token: accessToken } })
      .then(({ status, statusText }) => {
        if (status <= 201) {
          return history.push("/profile");
        } else {
          return alert(statusText);
        }
      })
      .catch((error) => {
        console.error(error);
        return alert(error);
      });
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
            Register incident
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewIncident;
