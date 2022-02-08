import React, { useState } from "react";
import "./Reservation.css";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";


const ReservationForm = ({ initialFormState, handleSubmit }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormState });
  
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleNumberInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    handleSubmit(formData, setFormData, e)
  }

  return (
    <form onSubmit={submitHandler}>
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
          placeholder="0"
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
  );
};

export default ReservationForm;
