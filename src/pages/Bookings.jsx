import { useEffect, useState } from "react";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../services/bookingService";
import { getCustomers } from "../services/customerService";
import { getRooms } from "../services/roomService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "",
    roomId: "",
    checkInDate: "",
    checkOutDate: "",
    status: "CONFIRMED",
  });

  const fetchBookings = async () => {
    try {
      const response = await getBookings();

      const bookingsData = Array.isArray(response.data)
        ? response.data
        : [];

      setBookings(bookingsData);
      setError("");
    } catch (err) {
      console.error("Error loading bookings:", err);
      setBookings([]);
      setError("Unable to load bookings from the backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [customersResponse, roomsResponse] = await Promise.all([
        getCustomers(),
        getRooms(),
      ]);

      const customersData = Array.isArray(customersResponse.data)
        ? customersResponse.data
        : [];

      const roomsData = Array.isArray(roomsResponse.data)
        ? roomsResponse.data
        : [];

      setCustomers(customersData);
      setRooms(roomsData);
    } catch (err) {
      console.error("Error loading customers or rooms:", err);
      setError("Unable to load customers or rooms.");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchFormData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleAddBooking = () => {
    setEditingBooking(null);

    setFormData({
      customerId: "",
      roomId: "",
      checkInDate: "",
      checkOutDate: "",
      status: "CONFIRMED",
    });

    setShowForm(true);
    setError("");
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);

    setFormData({
      customerId: booking.customer?.id
        ? String(booking.customer.id)
        : "",
      roomId: booking.room?.id ? String(booking.room.id) : "",
      checkInDate: booking.checkInDate || "",
      checkOutDate: booking.checkOutDate || "",
      status: booking.status || "CONFIRMED",
    });

    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBooking(null);

    setFormData({
      customerId: "",
      roomId: "",
      checkInDate: "",
      checkOutDate: "",
      status: "CONFIRMED",
    });

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.customerId || !formData.roomId) {
      setError("Please select a customer and a room.");
      return;
    }

    if (formData.checkOutDate <= formData.checkInDate) {
      setError("Check-out date must be after the check-in date.");
      return;
    }

    const bookingData = {
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: formData.status,
      customer: {
        id: Number(formData.customerId),
      },
      room: {
        id: Number(formData.roomId),
      },
    };

    try {
      if (editingBooking) {
        await updateBooking(editingBooking.id, bookingData);
      } else {
        await createBooking(bookingData);
      }

      handleCancel();
      await fetchBookings();
    } catch (err) {
      console.error("Error saving booking:", err);
      setError("Unable to save booking.");
    }
  };

  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBooking(id);
      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Unable to delete booking.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage hotel reservations and bookings.</p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddBooking}
        >
          + New Booking
        </button>
      </div>

      {showForm && (
        <div className="section-card">
          <div className="section-card-header">
            <h2>
              {editingBooking ? "Edit Booking" : "New Booking"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Customer</label>

                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select customer</option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Room</label>

                <select
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select room</option>

                  {rooms.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      Room {room.roomNumber} - {room.roomType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Check-in Date</label>

                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-out Date</label>

                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CHECKED_IN">CHECKED_IN</option>
                  <option value="CHECKED_OUT">CHECKED_OUT</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
              >
                {editingBooking
                  ? "Update Booking"
                  : "Save Booking"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
              The backend is connected, but there are currently no
              bookings in the database.
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking.id}
              >
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
                  <strong>Check-in:</strong>{" "}
                  {booking.checkInDate}
                </p>

                <p>
                  <strong>Check-out:</strong>{" "}
                  {booking.checkOutDate}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {booking.status}
                </p>

                <div className="card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => handleEditBooking(booking)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDeleteBooking(booking.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;