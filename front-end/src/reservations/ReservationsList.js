import React from "react";
import Reservation from "./Reservation";

const ReservationsList = ({ reservations, displayAll }) => {
  return (
    <div>
      <div className="reservations-container">
        {reservations.map((reservation) => (
          <Reservation
            key={reservation.reservation_id}
            reservation={reservation}
            display={displayAll}
          />
        ))}
      </div>
    </div>
  );
};

export default ReservationsList;