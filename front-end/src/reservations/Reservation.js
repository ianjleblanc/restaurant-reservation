import React, { useState } from "react";
import "./Reservation.css";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
const dayjs = require("dayjs");

const Reservation = ({ reservation }) => {
  const [error, setError] = useState(false);
  const history = useHistory();

  async function handleCancel(reservationId) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservationId);
        history.go();
      } catch (err) {
        setError(err);
      }
    }
  }

  return (
    <div>
      <ErrorAlert error={error} />

      {reservation.status !== "finished" && (
        <div className="reservation text-center">
          <h2 className="reservation-name">
            {reservation.first_name} {reservation.last_name}
          </h2>
          <hr />
          <p>Mobile Number: {reservation.mobile_number}</p>
          <p>
            Reservation Date:{" "}
            {dayjs(reservation.reservation_date).format("MMMM DD, YYYY")}
          </p>
          <p>Reservation Time: {reservation.reservation_time}</p>
          <p>People: {reservation.people}</p>
          <p data-reservation-id-status={`${reservation.reservation_id}`}>
            Status: {reservation.status}
          </p>

          <div className="reservation-btns">
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <Button variant="contained" color="info">
                Edit
              </Button>
            </a>
            {reservation.status === "booked" && (
              <a href={`/reservations/${reservation.reservation_id}/seat`}>
                <Button variant="contained" color="warning">
                  Seat
                </Button>
              </a>
            )}
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCancel(reservation.reservation_id)}
              data-reservation-id-cancel={`${reservation.reservation_id}`}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservation;