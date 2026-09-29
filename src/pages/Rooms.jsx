import { useEffect, useState } from "react";
import { getRooms } from "../services/roomService";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();

        const roomsData = Array.isArray(response.data)
          ? response.data
          : [];

        setRooms(roomsData);
        setError("");
      } catch (err) {
        console.error("Error loading rooms:", err);
        setRooms([]);
        setError("Unable to load rooms from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage hotel rooms and their availability.</p>
        </div>

        <button className="primary-button">+ Add Room</button>
      </div>

      <div className="section-card">
        <div className="table-header">
          <h2>Room List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search rooms..."
          />
        </div>

        {loading && (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading rooms...</h3>
            <p>Please wait while we fetch room information.</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Backend connection failed</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🛏️</div>
            <h3>No rooms available</h3>
            <p>
              The backend is connected, but there are currently no rooms in
              the database.
            </p>
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="room-list">
            {rooms.map((room) => (
              <div className="room-card" key={room.id}>
                <h3>Room {room.roomNumber}</h3>

                <p>
                  <strong>Type:</strong> {room.roomType}
                </p>

                <p>
                  <strong>Price:</strong> ₹{room.pricePerNight}
                </p>

                <p>
                  <strong>Status:</strong> {room.status}
                </p>

                <p>
                  <strong>Description:</strong>{" "}
                  {room.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rooms;