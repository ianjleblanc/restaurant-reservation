import React, { useState, useEffect } from "react";
// import "./Tables.css";
import { Button } from "@mui/material";
import { listReservations, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

const TableList = ({ table, loadDashboard }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory()
  useEffect(() => {
    listReservations().then(setReservations);
  }, []);

  async function handleFinish(tableId) {
    if (
      window.confirm(
        "Is this table ready to seat new guests?  This cannot be undone."
      )
    ) {
      try {
        await clearTable(tableId);
        history.go()
      } catch (err) {
        setError(err);
      }
    }
  }

  const foundRes = reservations.find(
    (reservation) =>
      Number(reservation.reservation_id) === Number(table.reservation_id)
  );

  return (
    <div className="table">
      <ErrorAlert error={error} />
      <h5 className="table-name text-center">Name: {table.table_name}</h5>
      <hr />
      <p>Capacity: {table.capacity}</p>
      <p data-table-id-status={`${table.table_id}`}>
        Status: {table.reservation_id ? <span className="text-danger">Occupied by </span> : <span>Free</span>}
        {foundRes && (
          <span className="text-danger">
            {foundRes.first_name} {foundRes.last_name}
          </span>
        )}
      </p>

      {table.reservation_id && (
        <Button
          type="submit"
          variant="contained"
          color="warning"
          data-table-id-finish={`${table.table_id}`}
          onClick={() => handleFinish(table.table_id)}
        >
          Finish
        </Button>
      )}
    </div>
  );
};

export default TableList;