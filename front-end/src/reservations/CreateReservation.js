import React, { useState } from "react";
import "./Reservation.css";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm"

const CreateReservation = () => {
  const [error, setError] = useState(null);
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };


  async function handleSubmit(formData, setFormData, e) {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      await createReservation(formData, abortController.signal);
      setFormData({ ...initialFormState });
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div>
      <h1 className="text-center create-header">Create a Reservation</h1>

      <ErrorAlert error={error} />
      <ReservationForm handleSubmit={handleSubmit} initialFormState={initialFormState}/>
      
    </div>
  );
};

export default CreateReservation;
