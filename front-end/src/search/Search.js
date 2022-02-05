import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import "./Search.css";

const Search = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleChange = (e) => {
    setSearchNumber(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const abortController = new AbortController();
    setError(false)
    setNoResults(false);
    try {
      // check if input is valid phone number
      if (
        /[a-zA-Z.,]/.test(
          searchNumber
        ) === true
      ) {
        throw new Error("Mobile Number must only include numbers");
      }
      const data = await listReservations(
        { mobile_number: searchNumber },
        abortController.signal
      );
      setReservations(data);
      setNoResults(true);
      setSearchNumber("");
    } catch (err) {
      setError(err);
    }

    return () => abortController.abort();
  }

  return (
    <div className="text-center" onSubmit={handleSubmit}>
      <h1 className="search-header">Search by Phone Number</h1>
      <ErrorAlert error={error} />
      <form className="search-form">
        <input
          type="text"
          name="mobile_number"
          value={searchNumber}
          onChange={handleChange}
          placeholder="123-456-7890"
          required
        />
        <button type="submit">
          <span className="oi oi-magnifying-glass"></span>
        </button>
      </form>

      {reservations.length > 0 && (
        <ReservationsList reservations={reservations} />
      )}
      {noResults && reservations.length === 0 ? (
        <h3>No reservations found</h3>
      ) : (
        ""
      )}
    </div>
  );
};

export default Search;