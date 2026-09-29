import { useCallback, useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchCustomers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });

    setShowForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await createCustomer(formData);
      }

      handleCancel();
      await fetchCustomers();
    } catch (err) {
      console.error("Error saving customer:", err);
      setError("Unable to save customer.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(id);
      await fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Unable to delete customer.");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage hotel customer information.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddCustomer}
        >
          + Add Customer
        </button>
      </div>

      {showForm && (
        <div className="section-card">
          <div className="section-card-header">
            <h2>
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingCustomer ? "Update Customer" : "Save Customer"}
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
              The backend is connected, but there are currently no
              customers in the database.
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

                <div className="card-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDeleteCustomer(customer.id)}
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

export default Customers;