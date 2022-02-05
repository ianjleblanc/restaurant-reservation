import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {
  createReservation,
//   readReservation,
//   updateReservation,
} from "../utils/api";

export default function CreateReservation() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);

  

  function handleCancel() {
    history.goBack()
  }

  function handleChange(e) {
    setFormData({...formData, 
      [e.target.id]: e.target.value
    })
    
  }

  async function handleSubmit(e) {
    formData.people = Number(formData.people)
    e.preventDefault();
    // AbortController?
    const ac = new AbortController();
    //call API function to make post request 
    await createReservation(formData, ac.signal).catch(setError)
    // history.push(`/dashboard?date=${formData.reservation_date}`)
    setFormData({...initialFormState})
    return ()=> ac.abort()
  
    
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            id="first_name"
            aria-describedby="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            id="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            value={formData.last_name}
          />
          <label htmlFor="phone">Mobile Number</label>
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
            min="1"
            value={formData.people}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button onClick={handleCancel} type="button" className="btn btn-primary">
          Cancel
        </button>
      </form>
    </div>
  );
}
