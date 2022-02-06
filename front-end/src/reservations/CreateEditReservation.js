import React, { useState, useEffect } from "react";
import "./Reservation.css";
import { Button } from "@mui/material";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
const dayjs = require("dayjs");

const CreateEditReservation = () => {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { reservationId } = useParams();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      try {
        if (reservationId) {
          const resResponse = await readReservation(
            reservationId,
            abortController.signal
          );
          setFormData(resResponse);
        } else {
          // if navigating to create route directly from edit route, clear the form
          setFormData({ ...initialFormState })
        }
      } catch (err) {
        setError(err);
      }
    }
    loadReservation();

    return () => abortController.abort();
    // eslint-disable-next-line
  }, [reservationId]);

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
      if (reservationId) {
        await updateReservation(formData, abortController.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
        setFormData({ ...initialFormState });
      } else {
        await createReservation(formData, abortController.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
        setFormData({ ...initialFormState });
      }
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div>
      {reservationId ? (
        <h1 className="text-center create-header">Edit a Reservation</h1>
      ) : (
        <h1 className="text-center create-header">Create a Reservation</h1>
      )}

      <ErrorAlert error={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            id="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            id="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="tel"
            name="mobile_number"
            className="form-control"
            id="mobile_number"
            placeholder="123-456-7890"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
          <label htmlFor="reservation_date">
            Date of Reservation (closed on Tuesdays)
          </label>

          <input
            type="date"
            name="reservation_date"
            className="form-control"
            id="reservation_date"
            min={dayjs().format("YYYY-MM-DD")}
            pattern="\d{4}-\d{2}-\d{2}"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />

          <label htmlFor="reservation_time">Time of Reservation</label>
          <input
            type="time"
            name="reservation_time"
            className="form-control"
            id="reservation_time"
            pattern="[0-9]{2}:[0-9]{2}"
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
          <label htmlFor="people">Party size</label>
          <input
            type="number"
            name="people"
            className="form-control"
            id="people"
            min={1}
            placeholder="1"
            value={formData.people}
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

export default CreateEditReservation;