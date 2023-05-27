import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import api from "../../../services/api";
import { FiArrowLeft } from "react-icons/fi";
import "./styles.css";
import logoImg from "../../../assets/logo.svg";

function EditIncident() {
  const ngoId = localStorage.getItem("ngoId");
  const { id: incidentId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    try {
      api
        .get(`/incident/${incidentId}`)
        .then((response) => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setValue(response.data.value);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      return alert(error.args);
    }
  }, []);

  async function handleEditIncident(event) {
    event.preventDefault();

    const data = {
      id: incidentId,
      title: title,
      description: description,
      value: value,
    };

    try {
      const response = await api.put("/incident", data, {
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditIncident;
