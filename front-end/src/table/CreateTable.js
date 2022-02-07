import React, { useState } from "react";
import "./Tables.css";
import ErrorAlert from "../layout/ErrorAlert";
import { Button } from "@mui/material";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";

const CreateTable = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleNumberInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: Number(e.target.value),
    });
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(formData, abortController.signal);
      setFormData({ ...initialFormState });
      history.push('/dashboard')
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div>
      <h1 className="text-center create-header">Create a Table</h1>

      <ErrorAlert error={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            name="table_name"
            className="form-control"
            id="table_name"
            placeholder="Table Name"
            value={formData.table_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            name="capacity"
            className="form-control"
            id="capacity"
            placeholder="0"
            min={1}
            value={formData.capacity}
            onChange={handleNumberInput}
            required
          />
        </div>
        <Button
          className="cancel-btn"
          variant="contained"
          color="warning"
          sx={{ mr: 1 }}
          onClick={history.goBack}
        >
          Cancel
        </Button>
        <Button type="submit" className="submit-btn" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CreateTable;