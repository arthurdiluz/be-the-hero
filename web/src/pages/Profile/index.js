import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2, FiEdit } from "react-icons/fi";
import api from "../../services/api";
import "./styles.css";
import logoImg from "../../assets/logo.svg";

function Profile() {
  const ngoId = localStorage.getItem("ngoId");
  const ngoName = localStorage.getItem("ngoName");
  const [incidents, setIncidents] = useState([]);

  const history = useHistory();

  if (!ngoId) return history.push("/");

  useEffect(() => {
    api
      .get("/profile", {
        headers: {
          authorization: ngoId,
        },
      })
      .then((response) => {
        setIncidents(response.data);
      });
  }, [ngoId]);

  async function handleDeleteIncident(id) {
    try {
      const response = await api.delete(`/incident/${id}`, {
        headers: {
          authorization: ngoId,
        },
      });

      if (response.status <= 204) {
        setIncidents(incidents.filter((incident) => incident.id !== id));
      } else {
        throw Error(response);
      }
    } catch (error) {
      alert(error.args);
    }
  }

  function handleLogout() {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Welcome, {ngoName}!</span>
        <Link className="button" to="/incident/new">
          Register a new case
        </Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>
      <h1>Registered cases</h1>
      {incidents.length === 0 && <h2>You have any registered case :(</h2>}
      <ul>
        {incidents.map((incident) => {
          return (
            <li key={incident.id}>
              <strong>CASE:</strong>
              <p>{incident.title}</p>
              <strong>DESCRIPTION:</strong>
              <p>{incident.description}</p>
              <strong>VALUE:</strong>
              <p>
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(incident.value)}
              </p>
              <button
                onClick={() => handleDeleteIncident(incident.id)}
                type="button"
                className="delete"
              >
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
              <Link
                type="button"
                to={`/incident/edit/${incident.id}`}
                className="edit"
              >
                <FiEdit size={20} color="#a8a8b3" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Profile;
