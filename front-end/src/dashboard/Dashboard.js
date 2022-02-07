import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import { Button } from "@mui/material";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import Table from "../tables/Table";
import { useLocation, useHistory } from "react-router-dom";
const dayjs = require("dayjs");

function Dashboard() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [isToday, setIsToday] = useState(false);
  const [date, setDate] = useState(query.get("date") || today());

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);
  // keeps url up to date even when using calendar input
  useEffect(() => {
    history.push(`dashboard?date=${date}`);
  }, [date, history]);

  function loadTables() {
    const abortController = new AbortController();
    setError(null);
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    let checkToday = dayjs(new Date()).format("YYYY-MM-DD");
    if (checkToday === date) {
      setIsToday(true);
    } else {
      setIsToday(false);
    }
  }, [date]);

  const handlePreviousDate = () => {
    setDate(previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  };

  const handleNextDate = () => {
    setDate(next(date));
    history.push(`dashboard?date=${next(date)}`);
  };

  return (
    <main>
      <div className="dashboard-header">
        <h1 className="text-center">Dashboard</h1>
        <div className="mb-5">
          <h4 className="mb-0 text-center">
            Reservations for date: {dayjs(date).format("MMMM DD YYYY")}{" "}
          </h4>

          {/* CALENDAR FORM */}
          <div className="text-center">
            <label htmlFor="reservation_date" className="form-label mt-3 mr-2">
              Search for a date:
            </label>
            <input
              type="date"
              pattern="\d{4}-\d{2}-\d{2}"
              name="reservation_date"
              onChange={handleDateChange}
              value={date}
            />
          </div>

          {/* DATE BUTTONS */}
          <div className="nav-btns">
            <Button
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
              onClick={() => handlePreviousDate(date)}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
              onClick={() => setDate(today())}
              disabled={isToday}
            >
              Today
            </Button>
            <Button
              variant="contained"
              color="warning"
              sx={{ mr: 1 }}
              onClick={() => handleNextDate(date)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <ErrorAlert error={error} />
      {reservations.length > 0 ? (
        <h1 className="text-center dashboard-section-header">Reservations</h1>
      ) : (
        <div className="text-center">
          <h1 className="dashboard-section-header">No Reservations</h1>
          <a href="reservations/new">
            <Button className="primary-btn" variant="contained" sx={{ mt: 1 }}>
              Add A Reservation?
            </Button>
          </a>
        </div>
      )}
      <ReservationsList reservations={reservations} />

      {/* TABLES */}
      <h2 className="text-center dashboard-section-header">Tables</h2>
      {tables && (
        <div className="tables-container">
          {tables.map((table) => (
            <Table
              key={table.table_id}
              table={table}
              loadDashboard={loadDashboard}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Dashboard;