import { useEffect, useState } from "react";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../services/roomService";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    pricePerNight: "",
    status: "AVAILABLE",
    description: "",
  });

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

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleAddRoom = () => {
    setEditingRoom(null);

    setFormData({
      roomNumber: "",
      roomType: "",
      pricePerNight: "",
      status: "AVAILABLE",
      description: "",
    });

    setShowForm(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);

    setFormData({
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || "",
      pricePerNight: room.pricePerNight || "",
      status: room.status || "AVAILABLE",
      description: room.description || "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRoom(null);

    setFormData({
      roomNumber: "",
      roomType: "",
      pricePerNight: "",
      status: "AVAILABLE",
      description: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const roomData = {
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      pricePerNight: Number(formData.pricePerNight),
      status: formData.status,
      description: formData.description,
    };

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, roomData);
      } else {
        await createRoom(roomData);
      }

      handleCancel();
      await fetchRooms();
    } catch (err) {
      console.error("Error saving room:", err);
      setError("Unable to save room.");
    }
  };

  const handleDeleteRoom = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRoom(id);
      await fetchRooms();
    } catch (err) {
      console.error("Error deleting room:", err);
      setError("Unable to delete room.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rooms</h1>
          <p>Manage hotel rooms and their availability.</p>
        </div>

        <button className="primary-button" onClick={handleAddRoom}>
          + Add Room
        </button>
      </div>

      {showForm && (
        <div className="section-card">
          <div className="section-card-header">
            <h2>{editingRoom ? "Edit Room" : "Add Room"}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <input
                  type="text"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price Per Night</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
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
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingRoom ? "Update Room" : "Save Room"}
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

                <div className="card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => handleEditRoom(room)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => handleDeleteRoom(room.id)}
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

export default Rooms;