import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers();

        const customersData = Array.isArray(response.data)
          ? response.data
          : [];

        setCustomers(customersData);
        setError("");
      } catch (err) {
        console.error("Error loading customers:", err);
        setCustomers([]);
        setError("Unable to load customers from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage hotel customer information.</p>
        </div>

        <button className="primary-button">+ Add Customer</button>
      </div>

      <div className="section-card">
        <div className="table-header">
          <h2>Customer List</h2>

          <input
            type="text"
            className="search-input"
            placeholder="Search customers..."
          />
        </div>

        {loading && (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading customers...</h3>
            <p>Please wait while we fetch customer information.</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Backend connection failed</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && customers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No customers available</h3>
            <p>
              The backend is connected, but there are currently no customers
              in the database.
            </p>
          </div>
        )}

        {!loading && !error && customers.length > 0 && (
          <div className="customer-list">
            {customers.map((customer) => (
              <div className="customer-card" key={customer.id}>
                <h3>{customer.name}</h3>

                <p>
                  <strong>Email:</strong> {customer.email}
                </p>

                <p>
                  <strong>Phone:</strong> {customer.phone}
                </p>

                <p>
                  <strong>Address:</strong> {customer.address}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;