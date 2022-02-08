import React, { useState, useEffect } from "react";
import "./Reservation.css";
import { readReservation, updateReservation } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

const EditReservation = () => {
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
        const resResponse = await readReservation(
          reservationId,
          abortController.signal
        );
        setFormData(resResponse);
      } catch (err) {
        setError(err);
      }
    }
    loadReservation();

    return () => abortController.abort();
    // eslint-disable-next-line
  }, [reservationId]);

  async function handleSubmit(e) {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      await updateReservation(formData, abortController.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
      setFormData({ ...initialFormState });
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div>
      <h1 className="text-center create-header">Edit a Reservation</h1>

      <ErrorAlert error={error} />
      <ReservationForm
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default EditReservation;
