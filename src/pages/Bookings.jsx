import { useEffect, useState } from "react";
import { getBookings } from "../services/bookingService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
        setError("");
      } catch (err) {
        console.error("Error loading bookings:", err);
        setError("Unable to load bookings from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage hotel reservations and bookings.</p>
        </div>

        <button className="primary-button">+ New Booking</button>
      </div>

      <div className="section-card">
        <div className="table-header">
          <h2>Booking List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search bookings..."
          />
        </div>

        {loading && (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading bookings...</h3>
            <p>Please wait while we fetch booking information.</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Backend connection failed</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings available</h3>
            <p>
              The backend is connected, but there are currently no bookings
              in the database.
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <h3>Booking #{booking.id}</h3>

                <p>
                  <strong>Room:</strong>{" "}
                  {booking.room?.roomNumber || "N/A"}
                </p>

                <p>
                  <strong>Customer:</strong>{" "}
                  {booking.customer?.name || "N/A"}
                </p>

                <p>
                  <strong>Check-in:</strong> {booking.checkInDate}
                </p>

                <p>
                  <strong>Check-out:</strong> {booking.checkOutDate}
                </p>

                <p>
                  <strong>Status:</strong> {booking.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;