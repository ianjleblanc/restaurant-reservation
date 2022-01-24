import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
// import {
//   createReservation,
//   readReservation,
//   updateReservation,
// } from "../utils/api";

export default function CreateReservation() {


  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState([]);

  const history = useHistory();

  function handleCancel() {
    history.goBack()
  }

  function handleChange(e) {
    setFormData({...formData, 
      [e.target.id]: e.target.value
    })
    
  }

  async function handleSubmit(e) {
    e.preventDefault();
    //call API function to make post request pass it the data
    console.log("data", formData)

    // display /dashboard page for date of new reserv.
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            class="form-control"
            id="first-name"
            aria-describedby="first-name"
            onChange={handleChange}
            placeholder="First Name"
          />
          <label for="last-name">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="last-name"
            placeholder="Last Name"
            onChange={handleChange}
          />
          <label for="phone">Mobile Number</label>
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
            // min={format("YYYY-MM-DD")}
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
            type="text"
            name="people"
            className="form-control"
            id="people"
            min={1}
            placeholder="1"
            value={formData.people}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
        <button onClick={handleCancel} type="button" class="btn btn-primary">
          Cancel
        </button>
      </form>
    </div>
  );
}
