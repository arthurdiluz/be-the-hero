import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../../services/api";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";
import logoImg from "../../../assets/logo.svg";

function EditIncident() {
  const { id: incidentId } = useParams();
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

  useEffect(() => {
    api
      .get(`/incident/${incidentId}`, {
        headers: { access_token: accessToken },
      })
      .then(({ data }) => {
        setTitle(data.title);
        setDescription(data.description);
        setValue(data.value);
      })
      .catch((error) => alert(error));
  }, [incidentId]);

  function handleEditIncident(event) {
    event.preventDefault();

    const data = {
      id: incidentId,
      title: title,
      description: description,
      value: value,
    };

    api
      .put(`/incident/${incidentId}`, data, {
        headers: { access_token: accessToken },
      })
      .then(({ status, statusText }) => {
        if (status <= 201) {
          return history.push("/profile");
        } else {
          return alert(statusText);
        }
      })
      .catch((error) => {
        return alert(error);
      });
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />
          <h1>Edit case</h1>
          <p>Update the information you want to change.</p>
          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#e02041" />
            Back to profile
          </Link>
        </section>
        <form onSubmit={handleEditIncident}>
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
            Update incident
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditIncident;
