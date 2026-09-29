import { useEffect, useState } from "react";
import {
  getDashboardRooms,
  getDashboardBookings,
} from "../services/dashboardService";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [roomsResponse, bookingsResponse] = await Promise.all([
          getDashboardRooms(),
          getDashboardBookings(),
        ]);

        const roomsData = Array.isArray(roomsResponse.data)
          ? roomsResponse.data
          : [];

        const bookingsData = Array.isArray(bookingsResponse.data)
          ? bookingsResponse.data
          : [];

        setRooms(roomsData);
        setBookings(bookingsData);
        setError("");
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setRooms([]);
        setBookings([]);
        setError("Unable to load dashboard data from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "AVAILABLE"
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "OCCUPIED"
  ).length;

  const totalBookings = bookings.length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your hotel management system.</p>
        </div>
      </div>

      {loading && (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading dashboard...</h3>
            <p>Please wait while we fetch the latest information.</p>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="section-card">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Backend connection failed</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-card-icon">🛏️</div>
              <div>
                <p>Total Rooms</p>
                <h2>{totalRooms}</h2>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">✅</div>
              <div>
                <p>Available Rooms</p>
                <h2>{availableRooms}</h2>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">🔑</div>
              <div>
                <p>Occupied Rooms</p>
                <h2>{occupiedRooms}</h2>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon">📅</div>
              <div>
                <p>Total Bookings</p>
                <h2>{totalBookings}</h2>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section-card">
              <div className="section-card-header">
                <h2>Quick Overview</h2>
              </div>

              <div className="overview-list">
                <div className="overview-item">
                  <span>🛏️ Total Rooms</span>
                  <strong>{totalRooms}</strong>
                </div>

                <div className="overview-item">
                  <span>✅ Available Rooms</span>
                  <strong>{availableRooms}</strong>
                </div>

                <div className="overview-item">
                  <span>🔑 Occupied Rooms</span>
                  <strong>{occupiedRooms}</strong>
                </div>

                <div className="overview-item">
                  <span>📅 Total Bookings</span>
                  <strong>{totalBookings}</strong>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-card-header">
                <h2>System Status</h2>
              </div>

              <div className="system-status">
                <div className="status-item">
                  <span className="status-dot"></span>
                  <span>Backend API</span>
                  <strong>Connected</strong>
                </div>

                <div className="status-item">
                  <span className="status-dot"></span>
                  <span>Database</span>
                  <strong>Connected</strong>
                </div>

                <div className="status-item">
                  <span className="status-dot"></span>
                  <span>Frontend</span>
                  <strong>Running</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;